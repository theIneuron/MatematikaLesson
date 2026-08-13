import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// 4-sinf · Dars 40 · Fazoviy shakllar va yoyilmalar
// 15 ekran · boshqariladigan audio · har bir mazmunli harakat yakunlangach navigatsiya ochiladi.
const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};
const FRAME_COUNTS = [3, 4, 4, 4, 4, 4, 4, 5, 2, 2, 2, 2, 2, 3, 5];
const TOTAL_SCREENS = FRAME_COUNTS.length;
const LESSON_META = { lessonId: "solids-4-40-v1", slug: "dars40-fazoviy-shakllar-va-yoyilmalar", lessonTitle: {"uz":"Fazoviy shakllar va yoyilmalar","ru":"Пространственные фигуры и развёртки","en":"Solid shapes and nets"}, skillTags: ["solid-shapes","polyhedra","cube","nets"] };
const LESSON_REWARD_TITLE = {
  "uz": "Yoyilma muhandisi",
  "ru": "Инженер развёрток",
  "en": "Net engineer"
};
const SCREEN_META = [
  { id: 's0', type: 'hook', template: 'hypothesis-choice', goal: 'diagnose-prior-model', mechanic: 'hypothesis-choice', active: true, assessed: false, scored: false, scope: 'hook', misconceptions: ['surface-feature-choice'] },
  { id: 's1', type: 'exploration', template: 'guided-model', goal: 'inspect-first-model', mechanic: 'guided-reveal', active: true, assessed: false, scored: false, scope: null, misconceptions: [] },
  { id: 's2', type: 'exploration', template: 'guided-compare', goal: 'compare-representations', mechanic: 'guided-reveal', active: true, assessed: false, scored: false, scope: null, misconceptions: ['representation-swap'] },
  { id: 's3', type: 'exploration', template: 'guided-construction', goal: 'build-mathematical-model', mechanic: 'guided-reveal', active: true, assessed: false, scored: false, scope: null, misconceptions: ['construction-order'] },
  { id: 's4', type: 'exploration', template: 'guided-second-model', goal: 'connect-second-representation', mechanic: 'guided-reveal', active: true, assessed: false, scored: false, scope: null, misconceptions: [] },
  { id: 's5', type: 'exploration', template: 'guided-pattern', goal: 'discover-pattern', mechanic: 'guided-reveal', active: true, assessed: false, scored: false, scope: null, misconceptions: ['visual-guess'] },
  { id: 's6', type: 'rule', template: 'guided-verification', goal: 'verify-discovery', mechanic: 'guided-reveal', active: true, assessed: false, scored: false, scope: null, misconceptions: ['unchecked-result'] },
  { id: 's7', type: 'rule', template: 'guided-rule', goal: 'formulate-rule', mechanic: 'guided-reveal', active: true, assessed: false, scored: false, scope: null, misconceptions: [] },
  { id: 's8', type: 'test', template: 'choice-retry', goal: 'apply-model', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'module-mikro', misconceptions: ['wrong-operation'] },
  { id: 's9', type: 'test', template: 'choice-retry', goal: 'apply-representation', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'module-mikro', misconceptions: ['wrong-representation'] },
  { id: 's10', type: 'test', template: 'choice-retry', goal: 'independent-application', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'module-mikro', misconceptions: ['calculation-slip'] },
  { id: 's11', type: 'strategy', template: 'strategy-choice', goal: 'choose-strategy', mechanic: 'strategy-choice', active: true, assessed: false, scored: false, scope: null, misconceptions: ['strategy-without-check'] },
  { id: 's12', type: 'error', template: 'error-repair', goal: 'repair-typical-error', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'module-mikro', misconceptions: ['repeat-typical-error'] },
  { id: 's13', type: 'case', template: 'life-transfer', goal: 'transfer-to-life-context', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'final', misconceptions: ['context-data-mismatch'] },
  { id: 's14', type: 'summary', template: 'guided-reflection', goal: 'reflect-and-bridge', mechanic: 'guided-reveal-and-reflection', active: true, assessed: false, scored: false, scope: null, misconceptions: [] },
];
const bi = (uz, ru, en) => ({ uz, ru, en });
const SOLUTION_LABEL = bi('YECHIM', 'РЕШЕНИЕ', 'SOLUTION');
const HOOK_FEEDBACK = bi("Tanlovingizni model bilan solishtiring. Keyingi ekranda sababni tekshirasiz.", 'Сравните свой выбор с моделью. На следующем экране вы проверите причину.', 'Compare your choice with the model. You will check the reason on the next screen.');
const REFLECTION = {
  question: bi("Bu mavzuda sizga qaysi usul ko'proq yordam berdi?", 'Какой способ больше всего помог вам в этой теме?', 'Which method helped you most in this topic?'),
  options: [
    bi("Modelni bosqichma-bosqich tekshirish", 'Проверять модель шаг за шагом', 'Checking the model step by step'),
    bi("Ikki tasvirni solishtirish", 'Сравнивать два представления', 'Comparing two representations'),
    bi("Javobni boshqa usul bilan tekshirish", 'Проверять ответ другим способом', 'Checking the answer another way'),
  ],
};
const CONTENT = {
  "s0": {
    "eyebrow": {
      "uz": "Qadoq laboratoriyasi",
      "ru": "Лаборатория упаковки",
      "en": "Packaging laboratory"
    },
    "title": {
      "uz": "Har olti kvadrat kub bo'ladimi?",
      "ru": "Любые шесть квадратов образуют куб?",
      "en": "Do any six squares make a cube?"
    },
    "scene": "hook",
    "closedSet": true,
    "frames": [
      {
        "uz": "Ikki shakl ham oltita kvadratdan tuzilgan.",
        "ru": "Обе фигуры состоят из шести квадратов.",
        "en": "Both shapes are made from six squares."
      },
      {
        "uz": "Ikkala yoyilma ham buklana boshlaydi.",
        "ru": "Обе развёртки начинают складываться.",
        "en": "Both nets begin to fold."
      },
      {
        "uz": "Ikkala yoyilma ham ustma-ust tushmasdan buklanadimi?",
        "ru": "Сложатся ли обе развёртки без наложения граней?",
        "en": "Will both nets fold without any faces overlapping?"
      }
    ],
    "question": {
      "uz": "Har olti kvadrat kub bo'ladimi?",
      "ru": "Любые шесть квадратов образуют куб?",
      "en": "Do any six squares make a cube?"
    },
    "options": [
      {
        "uz": "Ha, har qanday oltita kvadrat",
        "ru": "Да, любые шесть квадратов",
        "en": "Yes, any six squares"
      },
      {
        "uz": "Yo'q, kvadratlarning joylashuvi muhim",
        "ru": "Нет, расположение квадратов важно",
        "en": "No, the arrangement of the squares matters"
      },
      {
        "uz": "Faqat 2×3 ko'rinishida",
        "ru": "Только в виде прямоугольника 2×3",
        "en": "Only in a 2 by 3 rectangle"
      }
    ],
    "neutral": {
      "uz": "Taxmin saqlandi. Yoq, qirra, uch va yoyilmani tekshiramiz.",
      "ru": "Гипотеза сохранена. Проверим грани, рёбра, вершины и развёртку.",
      "en": "Estimate saved. We will check faces, edges, vertices and the net."
    },
    "audio": {
      "intro": {
        "uz": [
          "Ikki shakl ham oltita kvadratdan tuzilgan.",
          "Ikkala yoyilma ham buklana boshlaydi.",
          "Ikkala yoyilma ham ustma-ust tushmasdan buklanadimi?"
        ],
        "ru": [
          "Обе фигуры состоят из шести квадратов.",
          "Обе развёртки начинают складываться.",
          "Сложатся ли обе развёртки без наложения граней?"
        ],
        "en": [
          "Both shapes are made from six squares.",
          "Both nets begin to fold.",
          "Will both nets fold without any faces overlapping?"
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
      "uz": "Yassi va fazoviy",
      "ru": "Плоское и пространственное",
      "en": "Flat and solid"
    },
    "scene": "flat-solid",
    "frames": [
      {
        "uz": "Kvadrat — yassi shakl.",
        "ru": "Квадрат — плоская фигура.",
        "en": "A square is a flat shape."
      },
      {
        "uz": "Kub — fazoviy jism.",
        "ru": "Куб — пространственное тело.",
        "en": "A cube is a solid."
      },
      {
        "uz": "Yassi shakl yuzani egallaydi.",
        "ru": "Плоская фигура занимает площадь.",
        "en": "A flat shape has area."
      },
      {
        "uz": "Fazoviy jism bo'shliqda joy egallaydi.",
        "ru": "Пространственное тело занимает место в пространстве.",
        "en": "A solid occupies space."
      }
    ],
    "audio": {
      "uz": [
        "Kvadrat yassi shakldir.",
        "Kub fazoviy jismdir.",
        "Yassi shakl yuzani egallaydi.",
        "Fazoviy jism bo'shliqda joy egallaydi."
      ],
      "ru": [
        "Квадрат является плоской фигурой.",
        "Куб является пространственным телом.",
        "Плоская фигура занимает площадь.",
        "Пространственное тело занимает место в пространстве."
      ],
      "en": [
        "A square is a flat shape.",
        "A cube is a solid.",
        "A flat shape has area.",
        "A solid occupies space."
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
      "uz": "Yoq, qirra, uch",
      "ru": "Грань, ребро, вершина",
      "en": "Face, edge, vertex"
    },
    "scene": "parts",
    "frames": [
      {
        "uz": "Kubning bitta yog'ini ajrating.",
        "ru": "Выделите одну грань куба.",
        "en": "Highlight one face of the cube."
      },
      {
        "uz": "Ikki yoq tutashgan kesma — qirra.",
        "ru": "Отрезок, где встречаются две грани, — ребро.",
        "en": "The segment where two faces meet is an edge."
      },
      {
        "uz": "Qirralar tutashgan nuqta — uch.",
        "ru": "Точка, где встречаются рёбра, — вершина.",
        "en": "The point where edges meet is a vertex."
      },
      {
        "uz": "Yoq, qirra va uch nomlarini birga tekshiring.",
        "ru": "Проверьте вместе подписи грани, ребра и вершины.",
        "en": "Check the face, edge and vertex labels together."
      }
    ],
    "audio": {
      "uz": [
        "Kubning bitta yog'ini ajrating.",
        "Ikki yoq tutashgan kesma, qirra.",
        "Qirralar tutashgan nuqta, uch.",
        "Yoq, qirra va uch nomlarini birga tekshiring."
      ],
      "ru": [
        "Выделите одну грань куба.",
        "Отрезок, где встречаются две грани, ребро.",
        "Точка, где встречаются рёбра, вершина.",
        "Проверьте вместе подписи грани, ребра и вершины."
      ],
      "en": [
        "Highlight one face of the cube.",
        "The segment where two faces meet is an edge.",
        "The point where edges meet is a vertex.",
        "Check the face, edge and vertex labels together."
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
      "uz": "To'g'ri burchakli parallelepiped",
      "ru": "Прямоугольный параллелепипед",
      "en": "Cuboid"
    },
    "scene": "cuboid",
    "frames": [
      {
        "uz": "To'g'ri to'rtburchakli parallelepipedning uzunligi bor.",
        "ru": "У прямоугольного параллелепипеда есть длина.",
        "en": "A cuboid has length."
      },
      {
        "uz": "Uning eni bor.",
        "ru": "У него есть ширина.",
        "en": "It has width."
      },
      {
        "uz": "Uning balandligi bor.",
        "ru": "У него есть высота.",
        "en": "It has height."
      },
      {
        "uz": "Qarama-qarshi yoqlari teng bo'ladi.",
        "ru": "Противоположные грани равны.",
        "en": "Opposite faces are equal."
      }
    ],
    "audio": {
      "uz": [
        "To'g'ri to'rtburchakli parallelepipedning uzunligi bor.",
        "Uning eni bor.",
        "Uning balandligi bor.",
        "Qarama-qarshi yoqlari teng bo'ladi."
      ],
      "ru": [
        "У прямоугольного параллелепипеда есть длина.",
        "У него есть ширина.",
        "У него есть высота.",
        "Противоположные грани равны."
      ],
      "en": [
        "A cuboid has length.",
        "It has width.",
        "It has height.",
        "Opposite faces are equal."
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
      "uz": "Kub — maxsus parallelepiped",
      "ru": "Куб — особый параллелепипед",
      "en": "A cube is a special cuboid"
    },
    "scene": "cube",
    "frames": [
      {
        "uz": "Kubning barcha qirralari teng.",
        "ru": "Все рёбра куба равны.",
        "en": "Every edge of a cube is equal."
      },
      {
        "uz": "Uning yoqlari kvadratga aylanib ko'rinadi.",
        "ru": "Его грани выглядят как квадраты.",
        "en": "Its faces appear as squares."
      },
      {
        "uz": "Kubda 6 ta teng kvadrat yoq bor.",
        "ru": "У куба 6 равных квадратных граней.",
        "en": "A cube has 6 equal square faces."
      },
      {
        "uz": "Bu jism — kub.",
        "ru": "Это тело — куб.",
        "en": "This solid is a cube."
      }
    ],
    "audio": {
      "uz": [
        "Kubning barcha qirralari teng.",
        "Uning yoqlari kvadratga aylanib ko'rinadi.",
        "Kubda oltita teng kvadrat yoq bor.",
        "Bu jism kubdir."
      ],
      "ru": [
        "Все рёбра куба равны.",
        "Его грани выглядят как квадраты.",
        "У куба шесть равных квадратных граней.",
        "Это тело является кубом."
      ],
      "en": [
        "Every edge of a cube is equal.",
        "Its faces appear as squares.",
        "A cube has six equal square faces.",
        "This solid is a cube."
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
      "uz": "6-12-8",
      "ru": "6-12-8",
      "en": "6-12-8"
    },
    "scene": "count",
    "frames": [
      {
        "uz": "Kubda 6 yoq bor.",
        "ru": "У куба 6 граней.",
        "en": "A cube has 6 faces."
      },
      {
        "uz": "Kubda 12 qirra bor.",
        "ru": "У куба 12 рёбер.",
        "en": "A cube has 12 edges."
      },
      {
        "uz": "Kubda 8 uch bor.",
        "ru": "У куба 8 вершин.",
        "en": "A cube has 8 vertices."
      },
      {
        "uz": "Qayta sanamaslik uchun topilgan qismlarni ranglang.",
        "ru": "Раскрашивайте найденные части, чтобы не считать их повторно.",
        "en": "Colour each counted part to avoid counting it again."
      }
    ],
    "audio": {
      "uz": [
        "Kubda oltita yoq bor.",
        "Kubda o'n ikkita qirra bor.",
        "Kubda sakkizta uch bor.",
        "Qayta sanamaslik uchun topilgan qismlarni ranglang."
      ],
      "ru": [
        "У куба шесть граней.",
        "У куба двенадцать рёбер.",
        "У куба восемь вершин.",
        "Раскрашивайте найденные части, чтобы не считать их повторно."
      ],
      "en": [
        "A cube has six faces.",
        "A cube has twelve edges.",
        "A cube has eight vertices.",
        "Colour each counted part to avoid counting it again."
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
      "uz": "Yoyilma qanday buklanadi?",
      "ru": "Как складывается развёртка?",
      "en": "How does a net fold?"
    },
    "scene": "net-fold",
    "frames": [
      {
        "uz": "Markaziy yoq joyida qoladi.",
        "ru": "Центральная грань остаётся на месте.",
        "en": "The centre face stays in place."
      },
      {
        "uz": "Yon yoqlar yuqoriga ko'tariladi.",
        "ru": "Боковые грани поднимаются.",
        "en": "The side faces rise."
      },
      {
        "uz": "Oxirgi yoq kubni yopadi.",
        "ru": "Последняя грань закрывает куб.",
        "en": "The final face closes the cube."
      },
      {
        "uz": "Hech bir yoq ustma-ust tushmasligi kerak.",
        "ru": "Ни одна грань не должна накладываться на другую.",
        "en": "No face may overlap another."
      }
    ],
    "audio": {
      "uz": [
        "Markaziy yoq joyida qoladi.",
        "Yon yoqlar yuqoriga ko'tariladi.",
        "Oxirgi yoq kubni yopadi.",
        "Hech bir yoq ustma-ust tushmasligi kerak."
      ],
      "ru": [
        "Центральная грань остаётся на месте.",
        "Боковые грани поднимаются.",
        "Последняя грань закрывает куб.",
        "Ни одна грань не должна накладываться на другую."
      ],
      "en": [
        "The centre face stays in place.",
        "The side faces rise.",
        "The final face closes the cube.",
        "No face may overlap another."
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
      "uz": "Yoyilma tekshiruvi",
      "ru": "Проверка развёртки",
      "en": "Net check"
    },
    "scene": "net-check",
    "frames": [
      {
        "uz": "Yoqlar sonini tekshiring.",
        "ru": "Проверьте число граней.",
        "en": "Check the number of faces."
      },
      {
        "uz": "Har bir yoq shaklini tekshiring.",
        "ru": "Проверьте форму каждой грани.",
        "en": "Check the shape of each face."
      },
      {
        "uz": "Qo'shnilik tartibini tekshiring.",
        "ru": "Проверьте порядок соседних граней.",
        "en": "Check which faces are adjacent."
      },
      {
        "uz": "Yoyilmani xayolan buklang.",
        "ru": "Мысленно сложите развёртку.",
        "en": "Fold the net mentally."
      },
      {
        "uz": "Xochsimon yoyilma buklanadi; 2×3 blokda yoqlar ustma-ust tushadi.",
        "ru": "Крестообразная развёртка складывается; в блоке 2×3 грани накладываются.",
        "en": "The cross-shaped net folds; faces overlap in the 2×3 block."
      }
    ],
    "audio": {
      "uz": [
        "Yoqlar sonini tekshiring.",
        "Har bir yoq shaklini tekshiring.",
        "Qo'shnilik tartibini tekshiring.",
        "Yoyilmani xayolan buklang.",
        "Demak xochsimon yoyilma kubga buklanadi, ikki qator va uch ustunli blokda esa ikki yoq ustma-ust tushadi."
      ],
      "ru": [
        "Проверьте число граней.",
        "Проверьте форму каждой грани.",
        "Проверьте порядок соседних граней.",
        "Мысленно сложите развёртку.",
        "Итак, крестообразная развёртка складывается в куб, а в блоке два на три две грани накладываются."
      ],
      "en": [
        "Check the number of faces.",
        "Check the shape of each face.",
        "Check which faces are adjacent.",
        "Fold the net mentally.",
        "Therefore, the cross-shaped net folds into a cube, while two faces overlap in the two by three block."
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
      "uz": "Olti kvadrat yoq",
      "ru": "Шесть квадратных граней",
      "en": "Six square faces"
    },
    "scene": "solid-choice",
    "closedSet": true,
    "frames": [
      {
        "uz": "Jismning oltita kvadrat yog'i bor.",
        "ru": "У тела шесть квадратных граней.",
        "en": "The solid has six square faces."
      },
      {
        "uz": "Jism nomini tanlang.",
        "ru": "Выберите название тела.",
        "en": "Choose the name of the solid."
      }
    ],
    "question": {
      "uz": "Bu qaysi jism?",
      "ru": "Какое это тело?",
      "en": "Which solid is this?"
    },
    "options": [
      {
        "uz": "Kub",
        "ru": "Куб",
        "en": "Cube"
      },
      {
        "uz": "Silindr",
        "ru": "Цилиндр",
        "en": "Cylinder"
      },
      {
        "uz": "Piramida",
        "ru": "Пирамида",
        "en": "Pyramid"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "Oltita teng kvadrat yoqli fazoviy jism kubdir.",
      "ru": "Пространственное тело с шестью равными квадратными гранями является кубом.",
      "en": "A solid with six equal square faces is a cube."
    },
    "audio": {
      "intro": {
        "uz": [
          "Jismning oltita kvadrat yog'i bor.",
          "Jism nomini tanlang."
        ],
        "ru": [
          "У тела шесть квадратных граней.",
          "Выберите название тела."
        ],
        "en": [
          "The solid has six square faces.",
          "Choose the name of the solid."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Oltita teng kvadrat yoqli fazoviy jism kubdir.",
        "ru": "Верно. Пространственное тело с шестью равными квадратными гранями является кубом.",
        "en": "Correct. A solid with six equal square faces is a cube."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Oltita teng kvadrat yoqli fazoviy jism kubdir.",
          "ru": "Верно. Пространственное тело с шестью равными квадратными гранями является кубом.",
          "en": "Correct. A solid with six equal square faces is a cube."
        },
        {
          "uz": "Yana bir qarang: Silindrning ikkita doira yoqi va egri sirti bor; unda oltita kvadrat yoq yo'q. Oltita teng kvadrat yoqli jism kubdir.",
          "ru": "Посмотрите ещё раз: У цилиндра две круглые грани и криволинейная поверхность, а не шесть квадратных граней. Шесть равных квадратных граней образуют куб.",
          "en": "Look again: A cylinder has two circular faces and a curved surface, not six square faces. Six equal square faces identify a cube."
        },
        {
          "uz": "Yana bir qarang: Piramidaning yon yoqlari uchburchak bo'ladi. Oltita teng kvadrat yoq esa kubning xossasi.",
          "ru": "Посмотрите ещё раз: Боковые грани пирамиды являются треугольниками. Шесть равных квадратных граней являются признаком куба.",
          "en": "Look again: A pyramid has triangular side faces. Six equal square faces are the defining feature of a cube."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Oltita teng kvadrat yoqli fazoviy jism kubdir.",
        "ru": "Верно. Пространственное тело с шестью равными квадратными гранями является кубом.",
        "en": "Correct. A solid with six equal square faces is a cube."
      },
      {
        "uz": "Yana bir qarang: Silindrning ikkita doira yoqi va egri sirti bor; unda oltita kvadrat yoq yo'q. Oltita teng kvadrat yoqli jism kubdir.",
        "ru": "Посмотрите ещё раз: У цилиндра две круглые грани и криволинейная поверхность, а не шесть квадратных граней. Шесть равных квадратных граней образуют куб.",
        "en": "Look again: A cylinder has two circular faces and a curved surface, not six square faces. Six equal square faces identify a cube."
      },
      {
        "uz": "Yana bir qarang: Piramidaning yon yoqlari uchburchak bo'ladi. Oltita teng kvadrat yoq esa kubning xossasi.",
        "ru": "Посмотрите ещё раз: Боковые грани пирамиды являются треугольниками. Шесть равных квадратных граней являются признаком куба.",
        "en": "Look again: A pyramid has triangular side faces. Six equal square faces are the defining feature of a cube."
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
      "uz": "Parallelepiped pasporti",
      "ru": "Паспорт параллелепипеда",
      "en": "Cuboid profile"
    },
    "scene": "profile-choice",
    "closedSet": true,
    "frames": [
      {
        "uz": "To'g'ri to'rtburchakli parallelepipedni eslang.",
        "ru": "Вспомните прямоугольный параллелепипед.",
        "en": "Recall a cuboid."
      },
      {
        "uz": "Yoq, qirra va uchlar sonini tanlang.",
        "ru": "Выберите число граней, рёбер и вершин.",
        "en": "Choose its number of faces, edges and vertices."
      }
    ],
    "question": {
      "uz": "Qaysi profil to'g'ri?",
      "ru": "Какая тройка верна?",
      "en": "Which triple is correct?"
    },
    "options": [
      {
        "uz": "6-12-8",
        "ru": "6-12-8",
        "en": "6-12-8"
      },
      {
        "uz": "8-6-12",
        "ru": "8-6-12",
        "en": "8-6-12"
      },
      {
        "uz": "6-8-12",
        "ru": "6-8-12",
        "en": "6-8-12"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "To'g'ri to'rtburchakli parallelepipedda 6 ta yoq, 12 ta qirra va 8 ta uch bor.",
      "ru": "У прямоугольного параллелепипеда 6 граней, 12 рёбер и 8 вершин.",
      "en": "A cuboid has 6 faces, 12 edges and 8 vertices."
    },
    "audio": {
      "intro": {
        "uz": [
          "To'g'ri to'rtburchakli parallelepipedni eslang.",
          "Yoq, qirra va uchlar sonini tanlang."
        ],
        "ru": [
          "Вспомните прямоугольный параллелепипед.",
          "Выберите число граней, рёбер и вершин."
        ],
        "en": [
          "Recall a cuboid.",
          "Choose its number of faces, edges and vertices."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. To'g'ri to'rtburchakli parallelepipedda oltita yoq, o'n ikkita qirra va sakkizta uch bor.",
        "ru": "Верно. У прямоугольного параллелепипеда шесть граней, двенадцать рёбер и восемь вершин.",
        "en": "Correct. A cuboid has six faces, twelve edges and eight vertices."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. To'g'ri to'rtburchakli parallelepipedda oltita yoq, o'n ikkita qirra va sakkizta uch bor.",
          "ru": "Верно. У прямоугольного параллелепипеда шесть граней, двенадцать рёбер и восемь вершин.",
          "en": "Correct. A cuboid has six faces, twelve edges and eight vertices."
        },
        {
          "uz": "Yana bir qarang: Bu tartib sakkizni yoqlar soni deb oladi. Sakkiz: uchlar soni; pasport tartibi yoq, qirra, uch bo'lib, olti, o'n ikki, sakkizdir.",
          "ru": "Посмотрите ещё раз: Этот порядок принимает восемь за число граней. Восемь обозначает число вершин; порядок граней, рёбер и вершин даёт шесть, двенадцать, восемь.",
          "en": "Look again: This order treats eight as the face count. Eight counts vertices; faces, edges, vertices gives six, twelve, eight."
        },
        {
          "uz": "Yana bir qarang: Oltita yoq to'g'ri, ammo qirra va uch sonlari almashgan. Parallelepipedda o'n ikkita qirra va sakkizta uch bor.",
          "ru": "Посмотрите ещё раз: Шесть граней указаны верно, но числа рёбер и вершин поменяны местами. У параллелепипеда двенадцать рёбер и восемь вершин.",
          "en": "Look again: Six faces is correct, but the edge and vertex counts are swapped. A cuboid has twelve edges and eight vertices."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. To'g'ri to'rtburchakli parallelepipedda oltita yoq, o'n ikkita qirra va sakkizta uch bor.",
        "ru": "Верно. У прямоугольного параллелепипеда шесть граней, двенадцать рёбер и восемь вершин.",
        "en": "Correct. A cuboid has six faces, twelve edges and eight vertices."
      },
      {
        "uz": "Yana bir qarang: Bu tartib sakkizni yoqlar soni deb oladi. Sakkiz: uchlar soni; pasport tartibi yoq, qirra, uch bo'lib, olti, o'n ikki, sakkizdir.",
        "ru": "Посмотрите ещё раз: Этот порядок принимает восемь за число граней. Восемь обозначает число вершин; порядок граней, рёбер и вершин даёт шесть, двенадцать, восемь.",
        "en": "Look again: This order treats eight as the face count. Eight counts vertices; faces, edges, vertices gives six, twelve, eight."
      },
      {
        "uz": "Yana bir qarang: Oltita yoq to'g'ri, ammo qirra va uch sonlari almashgan. Parallelepipedda o'n ikkita qirra va sakkizta uch bor.",
        "ru": "Посмотрите ещё раз: Шесть граней указаны верно, но числа рёбер и вершин поменяны местами. У параллелепипеда двенадцать рёбер и восемь вершин.",
        "en": "Look again: Six faces is correct, but the edge and vertex counts are swapped. A cuboid has twelve edges and eight vertices."
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
      "uz": "Kub yoyilmasi",
      "ru": "Развёртка куба",
      "en": "Cube net"
    },
    "scene": "net-count",
    "closedSet": true,
    "frames": [
      {
        "uz": "Kub yoyilmasi kvadratlardan tuziladi.",
        "ru": "Развёртка куба состоит из квадратов.",
        "en": "A cube net is made from squares."
      },
      {
        "uz": "Har kvadrat bitta yoqqa aylanadi.",
        "ru": "Каждый квадрат станет одной гранью.",
        "en": "Each square becomes one face."
      }
    ],
    "question": {
      "uz": "Kub yoyilmasida nechta kvadrat bor?",
      "ru": "Сколько квадратов должно быть в развёртке куба?",
      "en": "How many squares must a cube net contain?"
    },
    "options": [
      {
        "uz": "6",
        "ru": "6",
        "en": "6"
      },
      {
        "uz": "8",
        "ru": "8",
        "en": "8"
      },
      {
        "uz": "12",
        "ru": "12",
        "en": "12"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "Kubning 6 ta yog'idan har biri yoyilmadagi bitta kvadratga mos keladi.",
      "ru": "Каждой из 6 граней куба соответствует один квадрат развёртки.",
      "en": "Each of the cube's 6 faces matches one square in its net."
    },
    "audio": {
      "intro": {
        "uz": [
          "Kub yoyilmasi kvadratlardan tuziladi.",
          "Har kvadrat bitta yoqqa aylanadi."
        ],
        "ru": [
          "Развёртка куба состоит из квадратов.",
          "Каждый квадрат станет одной гранью."
        ],
        "en": [
          "A cube net is made from squares.",
          "Each square becomes one face."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Kubning oltita yog'idan har biri yoyilmadagi bitta kvadratga mos keladi.",
        "ru": "Верно. Каждой из шести граней куба соответствует один квадрат развёртки.",
        "en": "Correct. Each of the cube's six faces matches one square in its net."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Kubning oltita yog'idan har biri yoyilmadagi bitta kvadratga mos keladi.",
          "ru": "Верно. Каждой из шести граней куба соответствует один квадрат развёртки.",
          "en": "Correct. Each of the cube's six faces matches one square in its net."
        },
        {
          "uz": "Yana bir qarang: Sakkiz kubning uchlari soni, yoyilmadagi kvadratlar soni emas. Har bir yoqqa bittadan kvadrat kerak, demak oltita.",
          "ru": "Посмотрите ещё раз: Восемь обозначает число вершин куба, а не квадратов развёртки. Каждой грани нужен один квадрат, всего шесть.",
          "en": "Look again: Eight is the number of cube vertices, not net squares. The net needs one square for each of six faces."
        },
        {
          "uz": "Yana bir qarang: O'n ikki kubning qirralari soni. Yoyilma qirralarni emas, yoqlarni ko'rsatadi; kubning oltita yoqi bor.",
          "ru": "Посмотрите ещё раз: Двенадцать обозначает число рёбер куба. Развёртка показывает грани, а не рёбра; у куба шесть граней.",
          "en": "Look again: Twelve is the number of cube edges. A net represents faces, not edges, and a cube has six faces."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Kubning oltita yog'idan har biri yoyilmadagi bitta kvadratga mos keladi.",
        "ru": "Верно. Каждой из шести граней куба соответствует один квадрат развёртки.",
        "en": "Correct. Each of the cube's six faces matches one square in its net."
      },
      {
        "uz": "Yana bir qarang: Sakkiz kubning uchlari soni, yoyilmadagi kvadratlar soni emas. Har bir yoqqa bittadan kvadrat kerak, demak oltita.",
        "ru": "Посмотрите ещё раз: Восемь обозначает число вершин куба, а не квадратов развёртки. Каждой грани нужен один квадрат, всего шесть.",
        "en": "Look again: Eight is the number of cube vertices, not net squares. The net needs one square for each of six faces."
      },
      {
        "uz": "Yana bir qarang: O'n ikki kubning qirralari soni. Yoyilma qirralarni emas, yoqlarni ko'rsatadi; kubning oltita yoqi bor.",
        "ru": "Посмотрите ещё раз: Двенадцать обозначает число рёбер куба. Развёртка показывает грани, а не рёбра; у куба шесть граней.",
        "en": "Look again: Twelve is the number of cube edges. A net represents faces, not edges, and a cube has six faces."
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
      "uz": "Qaysi yoyilma buklanadi?",
      "ru": "Какая развёртка складывается?",
      "en": "Which net folds?"
    },
    "scene": "net-choice",
    "closedSet": true,
    "frames": [
      {
        "uz": "Uch xil yoyilmani xayolan buklang.",
        "ru": "Мысленно сложите три развёртки.",
        "en": "Fold the three nets mentally."
      },
      {
        "uz": "Faqat ustma-ust tushmaydiganini tanlang.",
        "ru": "Выберите только ту, где грани не накладываются.",
        "en": "Choose only the one whose faces do not overlap."
      }
    ],
    "question": {
      "uz": "Qaysi yoyilma kubga buklanadi?",
      "ru": "Какая развёртка складывается в куб?",
      "en": "Which net folds into a cube?"
    },
    "options": [
      {
        "uz": "Xoch ko'rinishidagi yoyilma",
        "ru": "Развёртка в форме креста",
        "en": "Cross-shaped net"
      },
      {
        "uz": "2×3 to'rtburchak yoyilma",
        "ru": "Прямоугольная развёртка 2×3",
        "en": "2 by 3 rectangular net"
      },
      {
        "uz": "Halqa ko'rinishidagi yoyilma",
        "ru": "Развёртка в форме кольца",
        "en": "Ring-shaped net"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "Xoch ko'rinishidagi yoyilma buklanganda olti yoq bo'shliqsiz va ustma-ust tushmay yopiladi.",
      "ru": "Развёртка в форме креста складывается в шесть граней без щелей и наложений.",
      "en": "The cross-shaped net folds into six faces without gaps or overlaps."
    },
    "audio": {
      "intro": {
        "uz": [
          "Uch xil yoyilmani xayolan buklang.",
          "Faqat ustma-ust tushmaydiganini tanlang."
        ],
        "ru": [
          "Мысленно сложите три развёртки.",
          "Выберите только ту, где грани не накладываются."
        ],
        "en": [
          "Fold the three nets mentally.",
          "Choose only the one whose faces do not overlap."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Xoch ko'rinishidagi yoyilma buklanganda olti yoq bo'shliqsiz va ustma-ust tushmay yopiladi.",
        "ru": "Верно. Развёртка в форме креста складывается в шесть граней без щелей и наложений.",
        "en": "Correct. The cross-shaped net folds into six faces without gaps or overlaps."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Xoch ko'rinishidagi yoyilma buklanganda olti yoq bo'shliqsiz va ustma-ust tushmay yopiladi.",
          "ru": "Верно. Развёртка в форме креста складывается в шесть граней без щелей и наложений.",
          "en": "Correct. The cross-shaped net folds into six faces without gaps or overlaps."
        },
        {
          "uz": "Yana bir qarang: Ikki qator va uch ustunli blok buklanganda ikki chetki kvadrat bitta yoq joyiga kelib, ustma-ust tushadi.",
          "ru": "Посмотрите ещё раз: При складывании блока из двух рядов и трёх столбцов два крайних квадрата приходят на место одной грани и накладываются.",
          "en": "Look again: When the two-row, three-column block folds, two outer squares move into the same face position and overlap."
        },
        {
          "uz": "Yana bir qarang: Halqa tartibidagi qo'shnilik olti kvadratni kubning oltita turli yoqiga olib bormaydi. Buklanganda yoqlar to'qnashadi.",
          "ru": "Посмотрите ещё раз: Соседство квадратов в кольце не распределяет их по шести разным граням куба. При складывании грани сталкиваются.",
          "en": "Look again: The ring arrangement does not place its squares on six distinct cube faces. Its faces collide when folded."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Xoch ko'rinishidagi yoyilma buklanganda olti yoq bo'shliqsiz va ustma-ust tushmay yopiladi.",
        "ru": "Верно. Развёртка в форме креста складывается в шесть граней без щелей и наложений.",
        "en": "Correct. The cross-shaped net folds into six faces without gaps or overlaps."
      },
      {
        "uz": "Yana bir qarang: Ikki qator va uch ustunli blok buklanganda ikki chetki kvadrat bitta yoq joyiga kelib, ustma-ust tushadi.",
        "ru": "Посмотрите ещё раз: При складывании блока из двух рядов и трёх столбцов два крайних квадрата приходят на место одной грани и накладываются.",
        "en": "Look again: When the two-row, three-column block folds, two outer squares move into the same face position and overlap."
      },
      {
        "uz": "Yana bir qarang: Halqa tartibidagi qo'shnilik olti kvadratni kubning oltita turli yoqiga olib bormaydi. Buklanganda yoqlar to'qnashadi.",
        "ru": "Посмотрите ещё раз: Соседство квадратов в кольце не распределяет их по шести разным граням куба. При складывании грани сталкиваются.",
        "en": "Look again: The ring arrangement does not place its squares on six distinct cube faces. Its faces collide when folded."
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
      "uz": "Kubmi yoki parallelepipedmi?",
      "ru": "Куб или параллелепипед?",
      "en": "Cube or cuboid?"
    },
    "scene": "cube-choice",
    "closedSet": true,
    "frames": [
      {
        "uz": "Jismning barcha yoqlari teng kvadratlardan iborat.",
        "ru": "Все грани тела — равные квадраты.",
        "en": "Every face of the solid is an equal square."
      },
      {
        "uz": "Barcha qirralari ham teng.",
        "ru": "Все его рёбра тоже равны.",
        "en": "All its edges are equal too."
      }
    ],
    "question": {
      "uz": "Jismning eng aniq nomi qaysi?",
      "ru": "Каково наиболее точное название тела?",
      "en": "What is the most precise name for the solid?"
    },
    "options": [
      {
        "uz": "Kub",
        "ru": "Куб",
        "en": "Cube"
      },
      {
        "uz": "Kub bo'lmagan parallelepiped",
        "ru": "Прямоугольный параллелепипед, не являющийся кубом",
        "en": "A non-cube cuboid"
      },
      {
        "uz": "Silindr",
        "ru": "Цилиндр",
        "en": "Cylinder"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "Barcha yoqlari teng kvadrat bo'lgan jism kubdir.",
      "ru": "Тело, у которого все грани являются равными квадратами, является кубом.",
      "en": "A solid whose faces are all equal squares is a cube."
    },
    "audio": {
      "intro": {
        "uz": [
          "Jismning barcha yoqlari teng kvadratlardan iborat.",
          "Barcha qirralari ham teng."
        ],
        "ru": [
          "Все грани тела являются равными квадратами.",
          "Все его рёбра тоже равны."
        ],
        "en": [
          "Every face of the solid is an equal square.",
          "All its edges are equal too."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Barcha yoqlari teng kvadrat bo'lgan jism kubdir.",
        "ru": "Верно. Тело, у которого все грани являются равными квадратами, является кубом.",
        "en": "Correct. A solid whose faces are all equal squares is a cube."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Barcha yoqlari teng kvadrat bo'lgan jism kubdir.",
          "ru": "Верно. Тело, у которого все грани являются равными квадратами, является кубом.",
          "en": "Correct. A solid whose faces are all equal squares is a cube."
        },
        {
          "uz": "Yana bir qarang: Oddiy parallelepipedning yoqlari to'g'ri to'rtburchak va qirralari turli uzunlikda bo'lishi mumkin. Barcha yoqlar teng kvadrat bo'lsa, u kub.",
          "ru": "Посмотрите ещё раз: У обычного прямоугольного параллелепипеда грани могут быть прямоугольниками, а рёбра могут иметь разную длину. Равные квадратные грани задают куб.",
          "en": "Look again: An ordinary cuboid may have rectangular faces and unequal edge lengths. Equal square faces make it a cube."
        },
        {
          "uz": "Yana bir qarang: Silindrda egri sirt va doira yoqlar bor, kvadrat yoqlar yo'q. Barcha teng kvadrat yoqli jism kubdir.",
          "ru": "Посмотрите ещё раз: У цилиндра есть криволинейная поверхность и круглые грани, но нет квадратных граней. Равные квадратные грани образуют куб.",
          "en": "Look again: A cylinder has a curved surface and circular faces, not square faces. A solid with equal square faces is a cube."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Barcha yoqlari teng kvadrat bo'lgan jism kubdir.",
        "ru": "Верно. Тело, у которого все грани являются равными квадратами, является кубом.",
        "en": "Correct. A solid whose faces are all equal squares is a cube."
      },
      {
        "uz": "Yana bir qarang: Oddiy parallelepipedning yoqlari to'g'ri to'rtburchak va qirralari turli uzunlikda bo'lishi mumkin. Barcha yoqlar teng kvadrat bo'lsa, u kub.",
        "ru": "Посмотрите ещё раз: У обычного прямоугольного параллелепипеда грани могут быть прямоугольниками, а рёбра могут иметь разную длину. Равные квадратные грани задают куб.",
        "en": "Look again: An ordinary cuboid may have rectangular faces and unequal edge lengths. Equal square faces make it a cube."
      },
      {
        "uz": "Yana bir qarang: Silindrda egri sirt va doira yoqlar bor, kvadrat yoqlar yo'q. Barcha teng kvadrat yoqli jism kubdir.",
        "ru": "Посмотрите ещё раз: У цилиндра есть криволинейная поверхность и круглые грани, но нет квадратных граней. Равные квадратные грани образуют куб.",
        "en": "Look again: A cylinder has a curved surface and circular faces, not square faces. A solid with equal square faces is a cube."
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
      "uz": "Bitning 2×3 yoyilmasi",
      "ru": "Развёртка Бита 2×3",
      "en": "Bit's 2×3 net"
    },
    "scene": "overlap-error",
    "closedSet": true,
    "frames": [
      {
        "uz": "Bit 2×3 ko'rinishdagi oltita kvadratni tanladi.",
        "ru": "Бит выбрал шесть квадратов в прямоугольнике 2×3.",
        "en": "Bit chose six squares arranged as a 2 by 3 rectangle."
      },
      {
        "uz": "Buklanganda ikki yoq bir joyga tushadi.",
        "ru": "При складывании две грани попадают в одно место.",
        "en": "When folded, two faces occupy the same place."
      },
      {
        "uz": "Demak, bu kub yoyilmasi emas.",
        "ru": "Значит, это не развёртка куба.",
        "en": "Therefore, it is not a cube net."
      }
    ],
    "question": {
      "uz": "Bitning xulosasi qaysi?",
      "ru": "Верна ли развёртка Бита?",
      "en": "Is Bit's net valid?"
    },
    "options": [
      {
        "uz": "Yoyilmada ustma-ust tushish bor",
        "ru": "Грани развёртки накладываются",
        "en": "The net has overlapping faces"
      },
      {
        "uz": "Har olti kvadrat kub bo'ladi",
        "ru": "Любые шесть квадратов образуют куб",
        "en": "Any six squares make a cube"
      },
      {
        "uz": "Kubga besh yoq yetadi",
        "ru": "Кубу достаточно пяти граней",
        "en": "Five faces are enough for a cube"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "2×3 tartibdagi kvadratlar buklanganda ikki yoq bir joyga tushadi, shuning uchun bu kub yoyilmasi emas.",
      "ru": "При складывании квадратов в расположении 2×3 две грани накладываются, поэтому это не развёртка куба.",
      "en": "When a 2 by 3 arrangement is folded, two faces overlap, so it is not a cube net."
    },
    "audio": {
      "intro": {
        "uz": [
          "Bit ikki qator va uch ustun ko'rinishidagi oltita kvadratni tanladi.",
          "Buklanganda ikki yoq bir joyga tushadi.",
          "Demak, bu kub yoyilmasi emas."
        ],
        "ru": [
          "Бит выбрал шесть квадратов в виде прямоугольника два на три.",
          "При складывании две грани попадают в одно место.",
          "Значит, это не развёртка куба."
        ],
        "en": [
          "Bit chose six squares arranged as a two by three rectangle.",
          "When folded, two faces occupy the same place.",
          "Therefore, it is not a cube net."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Ikki qator va uch ustunli tartib buklanganda ikki yoq bir joyga tushadi, shuning uchun bu kub yoyilmasi emas.",
        "ru": "Верно. При складывании прямоугольника два на три две грани накладываются, поэтому это не развёртка куба.",
        "en": "Correct. When a two by three arrangement is folded, two faces overlap, so it is not a cube net."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Ikki qator va uch ustunli tartib buklanganda ikki yoq bir joyga tushadi, shuning uchun bu kub yoyilmasi emas.",
          "ru": "Верно. При складывании прямоугольника два на три две грани накладываются, поэтому это не развёртка куба.",
          "en": "Correct. When a two by three arrangement is folded, two faces overlap, so it is not a cube net."
        },
        {
          "uz": "Yana bir qarang: Oltita kvadrat soni yetarli emas; ularning qo'shniligi ham mos bo'lishi kerak. Ikki karra uch blok buklanganda ikki yoq ustma-ust tushadi.",
          "ru": "Посмотрите ещё раз: Шести квадратов недостаточно; важно и их соседство. При складывании блока два на три две грани накладываются.",
          "en": "Look again: Having six squares is not enough; their adjacency must work. In the two-by-three block, two faces overlap when folded."
        },
        {
          "uz": "Yana bir qarang: Besh yoq kubni yopmaydi, chunki kubning oltita yoqi bor. Bu yoyilmada esa oltita kvadrat bo'lsa-da, ikkitasi ustma-ust tushadi.",
          "ru": "Посмотрите ещё раз: Пять граней не закрывают куб, потому что у него шесть граней. Здесь квадратов шесть, но две грани накладываются.",
          "en": "Look again: Five faces cannot enclose a cube because it has six faces. This net has six squares, but two overlap."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Ikki qator va uch ustunli tartib buklanganda ikki yoq bir joyga tushadi, shuning uchun bu kub yoyilmasi emas.",
        "ru": "Верно. При складывании прямоугольника два на три две грани накладываются, поэтому это не развёртка куба.",
        "en": "Correct. When a two by three arrangement is folded, two faces overlap, so it is not a cube net."
      },
      {
        "uz": "Yana bir qarang: Oltita kvadrat soni yetarli emas; ularning qo'shniligi ham mos bo'lishi kerak. Ikki karra uch blok buklanganda ikki yoq ustma-ust tushadi.",
        "ru": "Посмотрите ещё раз: Шести квадратов недостаточно; важно и их соседство. При складывании блока два на три две грани накладываются.",
        "en": "Look again: Having six squares is not enough; their adjacency must work. In the two-by-three block, two faces overlap when folded."
      },
      {
        "uz": "Yana bir qarang: Besh yoq kubni yopmaydi, chunki kubning oltita yoqi bor. Bu yoyilmada esa oltita kvadrat bo'lsa-da, ikkitasi ustma-ust tushadi.",
        "ru": "Посмотрите ещё раз: Пять граней не закрывают куб, потому что у него шесть граней. Здесь квадратов шесть, но две грани накладываются.",
        "en": "Look again: Five faces cannot enclose a cube because it has six faces. This net has six squares, but two overlap."
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
      "uz": "Fazoviy shakl inspektori",
      "ru": "Инспектор объёмных фигур",
      "en": "Solid shape inspector"
    },
    "scene": "summary",
    "frames": [
      {
        "uz": "Fazoviy jism bo'shliqda joy egallaydi.",
        "ru": "Пространственное тело занимает место в пространстве.",
        "en": "A solid occupies space."
      },
      {
        "uz": "Yoq — jismning tekis qismi.",
        "ru": "Грань — плоская часть тела.",
        "en": "A face is a flat part of a solid."
      },
      {
        "uz": "Qirra va uch yoqlarni bog'laydi.",
        "ru": "Рёбра и вершины соединяют грани.",
        "en": "Edges and vertices connect faces."
      },
      {
        "uz": "Yoyilma jismning yassi modeli.",
        "ru": "Развёртка — плоская модель тела.",
        "en": "A net is a flat model of a solid."
      },
      {
        "uz": "Keyingi darsda simmetriyani o'rganamiz.",
        "ru": "На следующем уроке изучим симметрию.",
        "en": "Next, we will study symmetry."
      }
    ],
    "audio": {
      "uz": [
        "Fazoviy jism bo'shliqda joy egallaydi.",
        "Yoq jismning tekis qismidir.",
        "Qirra va uch yoqlarni bog'laydi.",
        "Yoyilma jismning yassi modelidir.",
        "Keyingi darsda simmetriyani o'rganamiz."
      ],
      "ru": [
        "Пространственное тело занимает место в пространстве.",
        "Грань является плоской частью тела.",
        "Рёбра и вершины соединяют грани.",
        "Развёртка является плоской моделью тела.",
        "На следующем уроке изучим симметрию."
      ],
      "en": [
        "A solid occupies space.",
        "A face is a flat part of a solid.",
        "Edges and vertices connect faces.",
        "A net is a flat model of a solid.",
        "Next, we will study symmetry."
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
function ConversionVisual({ scene, frame }) { const visual = <ConversionVisualContent scene={scene} frame={frame}/>; const sceneName = String(scene ?? ''); return /(^|-)hook($|-)/.test(sceneName) ? visual : <div className="canonical-visual-frame" data-g4-role="visual-frame" style={{ position: 'relative', isolation: 'isolate', minWidth: 0, maxWidth: '100%', height: '100%', overflow: 'hidden' }}>{visual}</div>; }
function ConversionVisualContent({ scene, frame }) {
  const f = Math.max(0, Math.min(4, frame));
  const on = (step) => step <= f ? 'topic-step topic-on' : 'topic-step';
  const crossCells = [[1,0],[0,1],[1,1],[2,1],[3,1],[1,2]];
  const blockCells = [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]];
  const ringCells = [[1,0],[0,1],[1,1],[2,1],[0,2],[2,2]];
  const netSquares = (cells, prefix) => cells.map(([x, y], index) => <rect key={prefix + index} x={x * 46} y={y * 46} width="42" height="42" rx="4" fill={index % 2 ? '#E5F5F6' : '#FFF0EA'} stroke="#173B52" strokeWidth="3"/>);
  if (scene === 'hook') return <div className="topic-visual topic-v40 scene-hook" aria-hidden="true"><svg viewBox="0 0 600 220">
    <g className={on(0)} transform="translate(36 36)">{netSquares(crossCells, 'hc')}<text x="70" y="174" textAnchor="middle" fill="#173B52" fontSize="18" fontWeight="900">A</text></g>
    <g className={on(0)} transform="translate(366 48)">{netSquares(blockCells, 'hb')}<text x="68" y="128" textAnchor="middle" fill="#173B52" fontSize="18" fontWeight="900">B</text></g>
    <g className={on(1)}><path d="M240 105 C270 74 304 74 334 105 M240 124 C270 155 304 155 334 124" fill="none" stroke="#168FA3" strokeWidth="5" strokeDasharray="9 7"/><path d="M329 94 l18 11 -18 10z M245 135 l-18-11 18-10z" fill="#168FA3"/></g>
    <g className={on(2)}><path d="M116 166 C116 132 138 116 166 104 M438 166 C438 132 460 116 488 104" fill="none" stroke="#168FA3" strokeWidth="5" strokeDasharray="9 7"/><path d="M158 99 l18 2 -10 15z M480 99 l18 2 -10 15z" fill="#168FA3"/><circle cx="300" cy="108" r="30" fill="#FFF0EA" stroke="#FF5B35" strokeWidth="4"/><text x="300" y="119" textAnchor="middle" fill="#FF5B35" fontSize="34" fontWeight="900">?</text></g>
  </svg></div>;
  if (scene === 'net-check') return <div className="topic-visual topic-v40 scene-net-check" aria-hidden="true"><svg viewBox="0 0 600 220">
    <g className={on(0)} transform="translate(34 34)">{netSquares(crossCells, 'cc')}</g>
    <g className={on(0)} transform="translate(374 48)">{netSquares(blockCells, 'cb')}</g>
    <g className={on(1)}><text x="112" y="202" textAnchor="middle" fill="#173B52" fontSize="18" fontWeight="900">6</text><text x="442" y="202" textAnchor="middle" fill="#173B52" fontSize="18" fontWeight="900">6</text></g>
    <g className={on(2)}><path d="M236 110 C268 80 302 80 334 110" fill="none" stroke="#168FA3" strokeWidth="5" strokeDasharray="9 7"/><path d="M329 99 l18 11 -18 10z" fill="#168FA3"/></g>
    <g className={on(3)}><path d="M88 98 l22-30 22 30 M420 94 l22-30 22 30" fill="none" stroke="#FF5B35" strokeWidth="5"/></g>
    <g className={on(4)}><circle cx="276" cy="176" r="20" fill="#95C93D"/><path d="M266 176 l8 8 15-20" fill="none" stroke="#173B52" strokeWidth="5"/><circle cx="540" cy="176" r="20" fill="#FFF0EA" stroke="#FF5B35" strokeWidth="4"/><path d="M530 166 l20 20 M550 166 l-20 20" stroke="#FF5B35" strokeWidth="5"/></g>
  </svg></div>;
  if (scene === 'net-choice') return <div className="topic-visual topic-v40 scene-net-choice" aria-hidden="true"><svg viewBox="0 0 600 220">
    <g className={on(0)} transform="translate(22 38) scale(.72)">{netSquares(crossCells, 'nc')}<text x="92" y="178" textAnchor="middle" fill="#173B52" fontSize="24" fontWeight="900">A</text></g>
    <g className={on(0)} transform="translate(230 52) scale(.72)">{netSquares(blockCells, 'nb')}<text x="68" y="132" textAnchor="middle" fill="#173B52" fontSize="24" fontWeight="900">B</text></g>
    <g className={on(0)} transform="translate(424 38) scale(.72)">{netSquares(ringCells, 'nr')}<text x="68" y="178" textAnchor="middle" fill="#173B52" fontSize="24" fontWeight="900">C</text></g>
    <g className={on(1)}><path d="M182 98 C202 78 214 78 230 96 M372 98 C390 78 402 78 420 96" fill="none" stroke="#168FA3" strokeWidth="4" strokeDasharray="8 6"/><path d="M224 87 l16 9 -16 9z M414 87 l16 9 -16 9z" fill="#168FA3"/></g>
  </svg></div>;
  const overlap = scene === 'overlap-error';
  const netMode = /net|overlap/.test(scene) || scene === 'hook';
  const cuboidMode = /cuboid|profile/.test(scene);
  const flatMode = scene === 'flat-solid';
  const cells = overlap
    ? [[0,0],[66,0],[132,0],[0,66],[66,66],[132,66]]
    : [[66,0],[0,66],[66,66],[132,66],[198,66],[66,132]];
  return <div className={'topic-visual topic-v40 scene-' + scene} aria-hidden="true"><svg viewBox="0 0 600 220">
    {(netMode || flatMode) && <g className={on(0)} transform={flatMode ? 'translate(58 52)' : 'translate(28 30)'}>
      {flatMode ? <rect x="20" y="18" width="128" height="128" rx="8" fill="#FFF0EA" stroke="#173B52" strokeWidth="5"/> : cells.map(([x,y],i)=><rect key={i} x={x} y={y} width="62" height="62" rx="5" fill={i%2?'#E5F5F6':'#FFF0EA'} stroke="#173B52" strokeWidth="4"/>)}
    </g>}
    <g className={on(1)} transform={cuboidMode ? 'translate(-20 0) scale(1.18 .82)' : ''}><path d="M378 54 l92 0 52 44 -92 0z M378 54 v92 l52 44 v-92z M430 98 l92-44 v92 l-92 44z" fill="#E5F5F6" stroke="#168FA3" strokeWidth="5" strokeLinejoin="round"/></g>
    {netMode && <g className={on(2)}><path d="M300 108 C336 82 355 74 385 76" fill="none" stroke="#FF5B35" strokeWidth="5" strokeDasharray="10 7"/><path d="M382 67 l18 8 -15 13z" fill="#FF5B35"/></g>}
    {/parts|count|cube|solid|profile/.test(scene) && <g className={on(2)}><path d="M378 54 l92 0 52 44 -92 0z" fill="#FFF0EA" opacity=".8"/><line x1="430" y1="98" x2="430" y2="190" stroke="#FF5B35" strokeWidth="7"/><circle cx="430" cy="98" r="9" fill="#95C93D"/></g>}
    {overlap && <g className={on(2)}><rect x="430" y="76" width="80" height="80" rx="7" fill="#FF5B35" opacity=".5"/><rect x="448" y="94" width="80" height="80" rx="7" fill="#168FA3" opacity=".5"/><path d="M452 76 l68 68 M520 76 l-68 68" stroke="#FF5B35" strokeWidth="7"/></g>}
    <g className={on(3)}>{[[378,54],[470,54],[522,98],[430,98],[378,146],[430,190],[522,146]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="5" fill="#95C93D"/>)}</g>
    <g className={on(4)}><rect x="448" y="16" width="118" height="34" rx="12" fill="#E7F3EC" stroke="#227A53" strokeWidth="3"/><text x="507" y="39" textAnchor="middle" fill="#173B52" fontSize="18" fontWeight="900">{overlap ? '✕' : '6 · 12 · 8'}</text></g>
  </svg></div>;
}
const RevealFrames = ({ frames, frame }) => { const t = useT(); const currentFrame = Math.max(0, Math.min(frame, frames.length - 1)); return <div className="reveal-grid">{frames.map((item, index) => <div className={index <= frame ? 'reveal-card show' : 'reveal-card'} data-current={index === currentFrame ? 'true' : undefined} key={index}><b>{index + 1}</b><span>{t(item)}</span></div>)}</div>; };
const GuidedFramePanel = ({ frames, step, onAdvance, audioReady }) => { const t = useT(); const complete = step >= frames.length - 1; return <div className="guided-panel" aria-live="polite"><div className="guided-progress" aria-label={`${step + 1} / ${frames.length}`}>{frames.map((_, index) => <i className={index <= step ? 'active' : ''} key={index}/>)}</div><div className="guided-frame"><b>{step + 1}</b><span>{t(frames[step])}</span></div><div className="guided-action">{complete ? <span className="guided-complete">✓ {t(bi('Bosqichlar tugadi', 'Шаги завершены', 'Steps complete'))}</span> : <button type="button" className="btn-white-accent step-button" disabled={!audioReady} onClick={onAdvance}>{t(bi('Keyingi qadam', 'Следующий шаг', 'Next step'))} →</button>}</div></div>; };
function HookScreen({ screen, storedAnswer, onAnswer, onPrev, onNext }) { const t = useT(); const c = CONTENT.s0; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null); const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0); const answerReady = isAudioReady(audio); const choose = (index) => { if (!answerReady) return; const nextAttempts = attempts + 1; setPicked(index); setAttempts(nextAttempts); audio.pushOneOff(t(HOOK_FEEDBACK)); onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: t(c.question), options: c.options.map((option) => t(option)), correctIndex: null, correctAnswer: null, studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: true, firstTry: storedAnswer?.firstTry ?? true, attempts: nextAttempts, wrongChoices: [] }); }; return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={picked !== null}><div className="stack hook-stack" data-g4-screen="hook"><header className="hook-intro"><span data-g4-role="hook-topic">{t(c.eyebrow)}</span><h1 data-g4-role="hook-title">{t(c.title)}</h1><h2 data-g4-role="hook-question">{t(c.question)}</h2></header><section className="hook-card" data-g4-role="hook-scene"><div className="hook-visual-frame" data-g4-role="visual-frame"><div className="hook-visual-content"><div className="hook-model"><ConversionVisual scene={c.scene} frame={audio.frame}/></div><RevealFrames frames={c.frames} frame={audio.frame}/></div><div className="hook-bit" data-g4-role="hook-bit"><BitSVG state="think"/></div></div></section><section className="question hook-question hook-answers" aria-live="polite"><div className="options">{c.options.map((option, index) => <button type="button" data-g4-role="answer-card" className={'option ' + (picked === index ? 'picked' : '')} disabled={!answerReady} onClick={() => choose(index)} key={index}><b>{String.fromCharCode(65 + index)}</b><span>{t(option)}</span></button>)}</div><div className="feedback-slot hook-feedback-slot">{picked !== null && <div className="feedback open neutral" data-g4-role="feedback-frame" data-g4-feedback="diagnostic"><div className="feedback-bit-wrap" data-g4-role="feedback-bit"><BitSVG className="feedback-bit" state="nod"/></div><p>{t(HOOK_FEEDBACK)}</p></div>}</div></section></div></Stage>; }
function InfoScreen({ screen, onPrev, onNext }) { const c = CONTENT[`s${screen}`]; const [step, setStep] = useState(0); const audio = useGuidedNarration(c.audio, screen, step); const complete = step >= c.frames.length - 1; const audioReady = isAudioReady(audio); const advance = () => { if (complete || !audioReady) return; const nextStep = step + 1; setStep(nextStep); audio.speakStep(nextStep); }; const bitState = screen === 7 ? 'happy' : ['focus', 'point', 'idea'][(screen - 1) % 3]; return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={complete}><div className="stack info-stack"><Heading c={c} state={bitState} showBit/><section className="model-card guided-card"><ConversionVisual scene={c.scene} frame={step}/><GuidedFramePanel frames={c.frames} step={step} onAdvance={advance} audioReady={audioReady}/></section></div></Stage>; }
function QuestionScreen({ screen, storedAnswer, onAnswer, onPrev, onNext }) { const t = useT(); const c = CONTENT[`s${screen}`]; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null); const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0); const [wrongChoices, setWrongChoices] = useState(storedAnswer?.wrongChoices ?? []); const openChoice = SCREEN_META[screen].type === 'strategy'; const revealed = picked !== null; const correct = openChoice ? revealed : picked === c.correctIndex; const canAnswer = isAudioReady(audio); const baseBitState = screen === 12 ? 'awkward' : screen === 13 ? 'point' : 'focus'; const bitState = revealed ? (correct ? 'nod' : 'awkward') : baseBitState; const choose = (index) => { if (!canAnswer || correct || wrongChoices.includes(index)) return; const ok = openChoice || index === c.correctIndex; const nextAttempts = attempts + 1; const nextWrongChoices = ok ? wrongChoices : [...wrongChoices, index]; setPicked(index); setAttempts(nextAttempts); setWrongChoices(nextWrongChoices); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(t(ok ? c.audio.on_correct : c.feedbackAudio[index])); onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: t(c.question), options: c.options.map((option) => t(option)), correctIndex: c.correctIndex, correctAnswer: t(c.options[c.correctIndex]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: ok, firstTry: storedAnswer?.firstTry === false ? false : nextAttempts === 1 && ok, attempts: nextAttempts, wrongChoices: nextWrongChoices }); }; const showProof = !openChoice && (correct || (!correct && wrongChoices.length >= 2)); return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={correct}><div className="stack question-stack"><Heading c={c} state={bitState} showBit/><section className="test-layout"><div className="test-model"><ConversionVisual scene={c.scene} frame={audio.frame}/><RevealFrames frames={c.frames} frame={audio.frame}/></div><div className="question" aria-live="polite"><h2>{t(c.question)}</h2><div className="options">{c.options.map((option, index) => { const cls = openChoice && picked === index ? 'picked' : index === c.correctIndex && correct ? 'right' : wrongChoices.includes(index) ? 'bad' : ''; return <button type="button" className={'option ' + cls} disabled={!canAnswer || correct || wrongChoices.includes(index)} onClick={() => choose(index)} key={index}><b>{String.fromCharCode(65 + index)}</b><span>{t(option)}</span></button>; })}</div><div className="feedback-slot question-feedback-slot">{revealed && <div className="feedback-stack"><div className={'feedback open ' + (correct ? 'correct' : 'wrong')} data-g4-role={correct ? 'feedback-frame bit-answer-comment' : 'feedback-frame'} data-g4-feedback={correct ? 'solution' : 'wrong'}><BitSVG className="feedback-bit" state={correct ? "nod" : "awkward"}/><p>{correct && <b className="proof-label">{t(SOLUTION_LABEL)}: </b>}{t(correct ? c.audio.on_correct : c.audio.on_wrong[picked])}</p></div>{showProof && <div className="proof"><b className="proof-label">{t(SOLUTION_LABEL)}</b><span>{t(c.proof)}</span></div>}</div>}</div></div></section></div></Stage>; }
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
  const t = useT(); const c = CONTENT.s14; const storedAnswer = finalState; const [step, setStep] = useState(storedAnswer.step); const [reflection, setReflection] = useState(storedAnswer.reflection); const [titleClaimed, setTitleClaimed] = useState(storedAnswer?.titleClaimed === true); const [revealRequested, setRevealRequested] = useState(false); const audio = useGuidedNarration(c.audio, screen, step); const complete = step >= c.frames.length - 1; const audioReady = isAudioReady(audio); const titleState = titleClaimed ? 'claimed' : 'unclaimed';
  const advance = () => { if (complete || !audioReady) return; const nextStep = step + 1; setStep(nextStep); onFinalState((previous) => ({ ...previous, step: nextStep })); audio.speakStep(nextStep); };
  const chooseReflection = (index) => { setReflection(index); onFinalState((previous) => ({ ...previous, reflection: index })); };
  const claimTitle = () => { if (reflection === null) return; if (!complete || !audioReady || titleClaimed || revealRequested) return; setRevealRequested(true); };
  const completeReveal = useCallback(() => { setRevealRequested(false); setTitleClaimed(true); onFinalState((previous) => ({ ...previous, titleClaimed: true })); }, [onFinalState]);
  const finish = () => { if (reflection === null || !titleClaimed) return; finishLesson(); };
return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={finish} canAdvance={complete && reflection !== null} canFinish={titleState === 'claimed'} finish><div className="stack summary-stack"><Heading c={c} state={titleState === 'claimed' ? 'happy' : 'idea'} showBit/>{!complete ? <section className="model-card summary-card guided-card"><ConversionVisual scene={c.scene} frame={step}/><GuidedFramePanel frames={c.frames} step={step} onAdvance={advance} audioReady={audioReady}/></section> : <div className="summary-complete"><section className="reflection-card final-reflection" data-g4-role="reflection" aria-live="polite"><h2>{t(REFLECTION.question)}</h2><div className="reflection-options">{REFLECTION.options.map((option, index) => <button type="button" className={'option ' + (reflection === index ? 'picked' : '')} disabled={!audioReady || revealRequested} onClick={() => chooseReflection(index)} key={index}><b>{String.fromCharCode(65 + index)}</b><span>{t(option)}</span></button>)}</div></section><G4TitleReveal active={revealRequested} title={LESSON_REWARD_TITLE} onComplete={completeReveal}/>{titleState !== 'claimed' ? <section className="title-claim-card"><span>★</span><h2>{t(LESSON_REWARD_TITLE)}</h2><button type="button" data-g4-role="title-claim" className="btn-white-accent g4-title-claim" disabled={reflection === null || revealRequested || !audioReady} onClick={claimTitle}>{t(bi('Unvonni olish', 'Получить звание', 'Claim title'))}</button></section> : null}{titleState === 'claimed' && <G4TitleCard title={LESSON_REWARD_TITLE} answers={answers}/>}</div>}</div></Stage>;
}
const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];
export default function Grade4Dars40({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) { const preview = previewMode ?? (langProp === undefined || langProp === null); const initialLang = normalizeLang(langProp); const [previewLang, setPreviewLang] = useState(initialLang); const lang = preview ? normalizeLang(previewLang) : initialLang; configureLesson({ ttsApiBase: ttsApiBase || '', voiceGender: voiceGender || 'f', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', previewMode: preview }); const [current, setCurrent] = useState(0); const [answers, setAnswers] = useState([]); const [finalState, setFinalState] = useState({ step: 0, reflection: null, titleClaimed: false }); const [startedAt] = useState(() => Date.now()); const finished = useRef(false); const recordAnswer = useCallback((answer) => setAnswers((previous) => { const next = [...previous]; const old = previous[answer.screenIdx]; next[answer.screenIdx] = { ...answer, firstTry: old ? old.firstTry : answer.firstTry }; return next; }), []); const finishLesson = useCallback(() => { if (finished.current) return; finished.current = true; const scored = SCREEN_META.map((meta, index) => meta.scored ? index : null).filter((index) => index !== null); const firstTryCorrect = scored.filter((index) => answers[index]?.firstTry === true).length; const payload = { lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle[lang], studentName: studentName || null, durationSec: Math.floor((Date.now() - startedAt) / 1000), totalQuestions: scored.length, correctAnswers: firstTryCorrect, scorePercent: Math.round(firstTryCorrect / scored.length * 100), finalScore: firstTryCorrect, finalTotal: scored.length, passed: firstTryCorrect / scored.length >= 0.6, firstTryStats: { total: scored.length, firstTryCorrect }, attemptsTotal: scored.reduce((sum, index) => sum + (answers[index]?.attempts ?? 0), 0), skillTags: LESSON_META.skillTags, answers: answers.filter(Boolean) }; if (onFinished) onFinished(payload); else console.log('[Grade4 Dars40 preview]', payload); }, [answers, lang, onFinished, startedAt, studentName]); const Current = SCREENS[current]; return <LangContext.Provider value={lang}><style>{STYLES}</style><div className={'lesson-root ' + (preview ? 'lesson-root-preview' : '')}>{preview && <div className="preview-language" aria-label={bi("Ko'rish tili", 'Язык предпросмотра', 'Preview language')[lang]}>{['uz', 'ru', 'en'].map((code) => <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} finalState={finalState} onFinalState={setFinalState} onPrev={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))} finishLesson={finishLesson}/></div></LangContext.Provider>; }

const TOPIC_STYLES = `
.topic-visual{width:100%;min-height:156px;display:grid;place-items:center;padding:8px 10px;border-radius:18px;background:linear-gradient(145deg,#FFFFFF,#EEF5F3);box-shadow:0 16px 34px -27px rgba(58,53,48,.58);overflow:hidden}
.topic-visual svg{display:block;width:min(100%,680px);height:auto;max-height:210px}
.topic-step{opacity:0;transform:translateY(8px) scale(.985);transform-origin:center;transition:opacity .5s ease,transform .6s cubic-bezier(.16,1,.3,1)}
.topic-step.topic-on{opacity:1;transform:none;animation:topic-micro-in .62s cubic-bezier(.16,1,.3,1) both}
.topic-v39 .topic-step.topic-on circle,.topic-v43 .topic-step.topic-on circle{animation:topic-pulse 1.8s ease-in-out 2}
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
@media(max-width:639.98px){.lesson-root-preview .stage-header{padding-top:52px}.screen-type{display:none}.stage{width:min(390px,100%)}.stage-header{padding-top:6px}.stage-chrome{min-height:46px}.chrome-title{max-width:92px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:9px}.chrome-actions{gap:4px}.screen-count{padding:4px 6px;font-size:9px}.audio-indicator{height:46px;padding:1px 3px}.audio-indicator button{width:44px;height:44px}.stage-content{grid-template-rows:minmax(0,1fr) 38px;padding-top:5px;padding-bottom:2px}.caption-slot{height:38px;min-height:38px;padding-top:3px}.caption{height:35px;padding:6px 9px;font-size:10px}.stage-nav{min-height:58px}.btn-white-accent,.btn-ghost{min-width:108px;min-height:48px;padding:0 10px;font-size:12px}.stack{gap:7px}.heading{height:56px;gap:8px}.heading h1{font-size:clamp(20px,6vw,24px)}.heading .g1-char{width:48px;height:60px}.model-card,.question,.test-model,.reflection-card{padding:8px;border-radius:15px}.model-card{grid-template-columns:minmax(126px,.86fr) minmax(156px,1.14fr);gap:7px}.hook-stack{grid-template-rows:auto minmax(0,.78fr) minmax(0,1.22fr)}.hook-question{grid-template-rows:auto auto minmax(52px,1fr)}.hook-question .options{grid-template-columns:repeat(3,minmax(0,1fr))}.hook-question .option{grid-template-columns:1fr;justify-items:center;align-content:center;text-align:center}.hook-question .option>b{display:none}.question h2{font-size:14px;line-height:1.16}.options{grid-template-columns:1fr;gap:5px}.option{min-height:44px;padding:5px 6px;border-radius:11px;grid-template-columns:24px 1fr;gap:5px;font-size:11px;line-height:1.15}.option>b{width:24px;height:24px}.feedback{padding:6px 7px;grid-template-columns:20px 1fr;gap:5px;font-size:10px}.proof{padding:5px 7px;font-size:9px}.test-layout{grid-template-columns:minmax(118px,.78fr) minmax(170px,1.22fr);gap:7px}.test-model{padding:6px}.test-model .reveal-grid{display:none}.question-feedback-slot{min-height:84px}.hook-feedback-slot{min-height:52px}.conversion-visual{height:100%;min-height:0;padding:6px;border-radius:13px;gap:6px}.guided-panel{grid-template-rows:8px minmax(58px,1fr) 46px;gap:7px}.guided-frame{min-height:58px;padding:8px;border-radius:13px;grid-template-columns:29px 1fr;gap:7px;font-size:11px}.guided-frame>b{width:29px;height:29px}.guided-action{min-height:46px}.step-button{min-width:124px}.guided-complete{padding:8px;font-size:10px}.summary-complete{grid-template-columns:1fr;grid-template-rows:88px minmax(0,1fr);gap:7px}.summary-complete .g4-title-card-stage{min-height:88px}.reflection-card h2{font-size:14px}.reflection-options{gap:5px}.preview-language{top:7px;left:50%;right:auto;transform:translateX(-50%)}
  .g4-title-reveal-card{min-height:100dvh;padding:24px 18px}
  .g4-title-reveal-medal{width:88px;height:88px;border-width:5px;font-size:40px}
  .g4-title-reveal-card h2{top:calc(50% + 62px);font-size:29px}
  .g4-title-card-stage{min-height:88px;padding:9px 59px 8px 51px;border-radius:14px}
  .g4-title-card-medal{left:8px;width:34px;height:34px;font-size:14px}
  .g4-title-card-bit{width:57px;height:71px}
  .g4-title-card-stage h2{font-size:14px}
}
@media(max-height:700px){.stage-header{padding-top:4px}.stage-chrome{min-height:44px}.stage-content{grid-template-rows:minmax(0,1fr) 34px}.caption-slot{height:34px;min-height:34px}.caption{height:31px;padding:5px 8px}.stage-nav{min-height:56px}.heading{height:52px}.heading .g1-char{width:44px;height:55px}.stack{gap:6px}.model-card,.question,.test-model,.reflection-card{padding:7px}.question-feedback-slot{min-height:78px}.hook-feedback-slot{min-height:48px}.guided-panel{grid-template-rows:7px minmax(52px,1fr) 44px;gap:5px}.guided-action{min-height:44px}.step-button{min-height:44px}.summary-complete{grid-template-rows:82px minmax(0,1fr)}}
.summary-complete>.title-claim-card{grid-column:auto}
@media(max-width:639.98px){.summary-complete{grid-template-rows:minmax(0,1fr) 88px}.title-claim-card{height:88px;padding:6px 7px;grid-template-columns:30px minmax(0,1fr) auto;place-items:center;align-content:center;gap:6px;text-align:left}.title-claim-card>span{font-size:28px}.title-claim-card h2{font-size:13px;line-height:1.1}.title-claim-card .g4-title-claim{min-width:96px;min-height:44px;padding:0 7px}}
@media(max-height:700px){.summary-complete{grid-template-rows:minmax(0,1fr) 82px}}
@media(max-width:639.98px) and (max-height:700px){.title-claim-card{height:82px}}
@media(prefers-reduced-motion:reduce){.lesson-root *{animation:none!important;transition:none!important}
  .g4-title-reveal-overlay,.g4-title-reveal-overlay *,.g4-title-card-stage,.g4-title-card-stage *{animation:none!important;transition:none!important}
  .g4-title-reveal-confetti,.g4-title-card-confetti{display:none!important}
  .g4-title-reveal-rays{opacity:.28!important;transform:translate(-50%,-50%)!important}
  .g4-title-reveal-medal{opacity:1!important;transform:translate(-50%,-50%)!important}
  .g4-title-reveal-card h2{opacity:1!important;transform:translateX(-50%)!important}
  .g4-title-card-stage{transform:none!important}
}
`;

const STYLES = `${G4_TITLE_STYLES}${TOPIC_STYLES}
.feedback-bit{width:25px;height:31px}.proof-label{margin-right:7px;color:${T.lime}}.title-claim-card{grid-column:1/-1;height:100%;display:grid;place-items:center;align-content:center;gap:12px;border-radius:20px;background:#fff;text-align:center;overflow:hidden}.title-claim-card>span{font-size:48px;color:#FFCE49}
.stage-hook .hook-card{position:relative;isolation:isolate;overflow:hidden;border:1px solid rgba(144,228,235,.12);border-radius:24px;background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%);box-shadow:0 22px 50px -30px rgba(14,33,44,.75)}
html:has(.lesson-root),body:has(.lesson-root),#root:has(.lesson-root),.lesson-page:has(.lesson-root),.lesson-frame:has(.lesson-root){width:100%;height:100%;min-height:0!important;margin:0;overflow:hidden!important;overscroll-behavior:none}.lesson-root,.lesson-root *{box-sizing:border-box}.lesson-root h1,.lesson-root h2,.lesson-root p{margin:0}.lesson-root button{font:inherit}.lesson-root{position:fixed;inset:0;width:100%;height:100dvh;min-height:0;overflow:hidden;color:${T.ink};background:radial-gradient(circle at 88% 9%,rgba(22,143,163,.11),transparent 25%),linear-gradient(145deg,#F7F8F4,#EEF3F1);font-family:'Manrope',system-ui,sans-serif}.stage{width:min(936px,100%);height:100dvh;margin:0 auto;display:grid;grid-template-rows:auto minmax(0,1fr) auto;overflow:hidden;background:rgba(245,245,240,.92);box-shadow:0 0 50px -34px rgba(${T.shadowBase},.45)}.stage-header{min-height:0;padding-top:9px;background:rgba(245,245,240,.96);backdrop-filter:blur(10px);z-index:5}.progress-track{height:7px;border-radius:999px;overflow:hidden;background:#DDE5E3}.progress-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,${T.cyan},${T.lime});transition:width .45s ease}.progress-bar{box-shadow:0 0 15px rgba(22,143,163,.34)}.stage-chrome{min-height:48px;display:flex;align-items:center;justify-content:space-between;gap:12px}.chrome-title,.chrome-actions{display:flex;align-items:center;gap:9px}.chrome-title{color:${T.navy};font-size:12px;font-weight:900}.status-dot{width:9px;height:9px;border-radius:50%;background:${T.accent};box-shadow:0 0 0 5px rgba(255,91,53,.1)}.screen-type,.screen-count{padding:5px 9px;border-radius:999px;color:${T.cyan};background:${T.cyanSoft};font-size:10px;font-weight:900}.screen-count{color:${T.ink2};background:#FFF}.audio-indicator{height:46px;padding:3px 6px;border-radius:13px;display:flex;align-items:center;gap:4px;background:#FFF;box-shadow:0 9px 20px -17px rgba(${T.shadowBase},.6)}.audio-indicator button{width:44px;height:44px;border:0;border-radius:9px;background:transparent;cursor:pointer}.audio-wave{height:20px;display:flex;align-items:center;gap:2px}.audio-wave i{width:3px;height:6px;border-radius:4px;background:${T.cyan};transition:.25s}.audio-wave.playing i:nth-child(1){height:12px}.audio-wave.playing i:nth-child(2){height:18px}.audio-wave.playing i:nth-child(3){height:9px}
.stage-content{min-height:0;padding-top:7px;padding-bottom:4px;display:grid;grid-template-rows:minmax(0,1fr) 40px;overflow:hidden}.stage-body{min-height:0;overflow:hidden}.caption-slot{height:40px;min-height:40px;padding-top:4px;overflow:hidden}.stage-nav{min-height:62px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(245,245,240,.95)}.btn-white-accent,.btn-ghost{min-width:128px;min-height:50px;padding:0 18px;border:0;border-radius:15px;cursor:pointer;font-weight:900}.btn-white-accent{color:${T.accent};background:#fff;box-shadow:0 12px 24px -17px rgba(255,91,53,.8)}.btn-white-accent:hover:not(:disabled){color:#fff;background:${T.accent}}.btn-ghost{color:${T.ink2};background:transparent}.btn-ghost:hover{background:#fff}.stack{height:100%;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr);gap:10px;overflow:hidden;animation:page-in .45s cubic-bezier(.16,1,.3,1) both}.heading{height:68px;min-height:0;display:flex;align-items:center;justify-content:space-between;gap:16px}.heading.heading-solo{justify-content:flex-start}.heading>div>span{color:${T.cyan};font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.heading h1{margin-top:4px!important;font:750 clamp(25px,4vw,38px)/1.06 'Source Serif 4',Georgia,serif}.heading .g1-char{width:62px;height:76px;flex:0 0 auto;filter:drop-shadow(0 9px 11px rgba(23,59,82,.2))}.model-card,.question,.test-model{min-height:0;padding:14px;overflow:hidden;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.model-card{height:100%;display:grid;grid-template-columns:minmax(250px,.85fr) minmax(300px,1.15fr);align-items:stretch;gap:14px}.hook-card{background:linear-gradient(135deg,${T.cyanSoft},#FFF)}.summary-card{background:linear-gradient(135deg,#FFF,${T.successSoft})}.reveal-grid{min-height:0;display:grid;align-content:center;gap:7px;overflow:hidden}.reveal-card{min-height:48px;padding:9px 12px;border-radius:14px;display:grid;grid-template-columns:30px 1fr;align-items:center;gap:9px;opacity:.12;transform:translateY(7px);background:#F8F8F4;transition:.38s ease}.reveal-card.show{opacity:1;transform:none}.reveal-card>b{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;color:#FFF;background:${T.cyan};font:900 10px 'JetBrains Mono',monospace}.reveal-card:last-child.show{background:${T.cyanSoft}}.question{height:100%;display:grid;grid-template-rows:auto auto minmax(92px,1fr);align-content:start;gap:9px}.question h2{font:720 clamp(17px,2.5vw,22px)/1.25 'Source Serif 4',Georgia,serif}.options{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.option{min-height:50px;padding:8px;border:0;border-radius:16px;display:grid;grid-template-columns:28px 1fr;align-items:center;gap:8px;color:${T.ink};background:#F8F8F4;text-align:left;cursor:pointer;transition:.25s}.option:hover:not(:disabled){transform:translateY(-2px)}.option>b{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;color:${T.cyan};background:${T.cyanSoft};font:900 11px 'JetBrains Mono',monospace}.option.picked{background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.27)}.option.right{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.25)}.option.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.25)}.feedback{padding:8px 10px;border-radius:13px;display:grid;grid-template-columns:25px 1fr;align-items:start;gap:7px;font-size:12px;line-height:1.22}.feedback.correct{background:${T.successSoft};box-shadow:inset 4px 0 ${T.success}}.feedback.wrong{background:${T.warnSoft};box-shadow:inset 4px 0 ${T.warn}}.feedback.neutral{background:${T.cyanSoft};box-shadow:inset 4px 0 ${T.cyan}}.proof{padding:7px 10px;border-radius:11px;overflow:hidden;color:#FFF;background:${T.navy};text-align:center;font:900 15px 'JetBrains Mono',monospace}.test-layout{height:100%;min-height:0;display:grid;grid-template-columns:.86fr 1.14fr;gap:10px;overflow:hidden}.test-model{display:grid;grid-template-rows:minmax(0,1fr) auto;align-content:stretch;gap:8px}.caption{height:36px;margin:0;padding:7px 11px;border-radius:12px;overflow:hidden;color:#fff;background:rgba(23,59,82,.94);font-size:11px;line-height:1.2;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2}.feedback-slot{min-height:0;overflow:hidden}.feedback-stack{height:100%;display:grid;align-content:start;gap:6px;overflow:hidden}.question-feedback-slot{min-height:92px}.hook-feedback-slot{min-height:58px}.guided-panel{min-height:0;display:grid;grid-template-rows:10px minmax(72px,1fr) 50px;gap:10px;overflow:hidden}.guided-progress{display:flex;align-items:center;gap:6px}.guided-progress i{height:6px;flex:1;border-radius:999px;background:#DDE5E3}.guided-progress i.active{background:${T.cyan}}.guided-frame{min-height:72px;padding:12px;border-radius:16px;display:grid;grid-template-columns:34px 1fr;align-items:center;gap:10px;overflow:hidden;background:#F8F8F4;font-weight:850}.guided-frame>b{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;color:#FFF;background:${T.cyan};font:900 12px 'JetBrains Mono',monospace}.guided-action{display:flex;align-items:center;justify-content:flex-end;min-height:50px}.step-button{min-width:150px}.guided-complete{padding:10px 12px;border-radius:12px;color:${T.success};background:${T.successSoft};font-size:12px;font-weight:900}.summary-complete{height:100%;min-height:0;display:grid;grid-template-columns:.9fr 1.1fr;gap:10px;overflow:hidden}.summary-complete .g4-title-card-stage{height:100%;min-height:0}.reflection-card{min-height:0;padding:14px;border-radius:20px;display:grid;grid-template-rows:auto minmax(0,1fr);gap:9px;overflow:hidden;background:#FFF;box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.reflection-card h2{font:720 18px/1.22 'Source Serif 4',Georgia,serif}.reflection-options{min-height:0;display:grid;grid-template-rows:repeat(3,minmax(44px,1fr));gap:7px;overflow:hidden}
.conversion-visual{min-height:210px;padding:14px;border-radius:20px;display:grid;place-items:center;gap:12px;background:linear-gradient(145deg,${T.cyanSoft},#FFF)}.relation-cards{width:100%;display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.relation-cards span{padding:12px 8px;border-radius:13px;opacity:.18;background:#FFF;text-align:center;font:900 12px 'JetBrains Mono',monospace;transition:.35s}.relation-cards span.active{opacity:1;color:#FFF;background:${T.cyan}}.console-screen{padding:13px 24px;border-radius:14px;color:#FFF;background:${T.navy};font:900 25px 'JetBrains Mono',monospace}.cross{position:absolute;color:${T.accent};font-size:84px;font-weight:900;opacity:0;transform:scale(.6) rotate(-15deg);transition:.4s}.cross.show{opacity:.85;transform:scale(1) rotate(-15deg)}.console{position:relative}.tape-line{width:260px;height:28px;padding:4px;border-radius:10px;background:#FFF}.tape-line i{height:100%;display:block;border-radius:7px;background:${T.cyan};transition:.5s}.tape strong{font:900 18px 'JetBrains Mono',monospace}.area-grid>div{width:150px;height:150px;padding:3px;display:grid;grid-template-columns:repeat(10,1fr);gap:2px;border:3px solid ${T.navy};border-radius:12px;background:#FFF}.area-grid i{border-radius:2px;background:#DDE7E6;transition:.35s}.area-grid i.active{background:${T.cyan}}.area-grid strong{font:900 14px 'JetBrains Mono',monospace}.algorithm{align-content:center}.algorithm span{width:min(380px,100%);padding:10px 14px;border-radius:12px;opacity:.16;background:#FFF;text-align:center;font:900 13px 'JetBrains Mono',monospace;transition:.35s}.algorithm span.active{opacity:1}.algorithm span:last-child.active{color:#FFF;background:${T.success}}.manifest{grid-template-columns:repeat(2,1fr)}.manifest span{padding:20px 12px;border-radius:15px;opacity:.2;background:#FFF;text-align:center;font-weight:900;transition:.35s}.manifest span.active{opacity:1;color:#FFF;background:${T.navy}}.direction>div{display:flex;align-items:center;gap:14px}.direction b{padding:15px;border-radius:13px;background:#FFF}.direction span{color:${T.accent};font-size:30px}.direction small{font-weight:900}.preview-language{position:fixed;top:9px;right:9px;z-index:30;display:flex;gap:3px;padding:3px;border-radius:999px;background:rgba(255,255,255,.94)}.preview-language button{min-width:44px;min-height:44px;padding:4px 9px;border:0;border-radius:999px;background:transparent;cursor:pointer;font-size:10px;font-weight:900}.preview-language .preview-active{color:#FFF;background:${T.accent}}button:focus-visible,input:focus-visible{outline:3px solid rgba(22,143,163,.48);outline-offset:3px}@keyframes page-in{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
@media(max-width:639.98px){.lesson-root-preview .stage-header{padding-top:52px}.screen-type{display:none}.stage{width:min(390px,100%)}.stage-header{padding-top:6px}.stage-chrome{min-height:46px}.chrome-title{max-width:92px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:9px}.chrome-actions{gap:4px}.screen-count{padding:4px 6px;font-size:9px}.audio-indicator{height:46px;padding:1px 3px}.audio-indicator button{width:44px;height:44px}.stage-content{grid-template-rows:minmax(0,1fr) 38px;padding-top:5px;padding-bottom:2px}.caption-slot{height:38px;min-height:38px;padding-top:3px}.caption{height:35px;padding:6px 9px;font-size:10px}.stage-nav{min-height:58px}.btn-white-accent,.btn-ghost{min-width:108px;min-height:48px;padding:0 10px;font-size:12px}.stack{gap:7px}.heading{height:56px;gap:8px}.heading h1{font-size:clamp(20px,6vw,24px)}.heading .g1-char{width:48px;height:60px}.model-card,.question,.test-model,.reflection-card{padding:8px;border-radius:15px}.model-card{grid-template-columns:minmax(126px,.86fr) minmax(156px,1.14fr);gap:7px}.hook-stack{grid-template-rows:auto minmax(0,.78fr) minmax(0,1.22fr)}.hook-question{grid-template-rows:auto auto minmax(52px,1fr)}.hook-question .options{grid-template-columns:repeat(3,minmax(0,1fr))}.hook-question .option{grid-template-columns:1fr;justify-items:center;align-content:center;text-align:center}.hook-question .option>b{display:none}.question h2{font-size:14px;line-height:1.16}.options{grid-template-columns:1fr;gap:5px}.option{min-height:44px;padding:5px 6px;border-radius:11px;grid-template-columns:24px 1fr;gap:5px;font-size:11px;line-height:1.15}.option>b{width:24px;height:24px}.feedback{padding:6px 7px;grid-template-columns:20px 1fr;gap:5px;font-size:10px}.proof{padding:5px 7px;font-size:9px}.test-layout{grid-template-columns:minmax(118px,.78fr) minmax(170px,1.22fr);gap:7px}.test-model{padding:6px}.test-model .reveal-grid{display:none}.question-feedback-slot{min-height:84px}.hook-feedback-slot{min-height:52px}.conversion-visual{height:100%;min-height:0;padding:6px;border-radius:13px;gap:6px}.guided-panel{grid-template-rows:8px minmax(58px,1fr) 46px;gap:7px}.guided-frame{min-height:58px;padding:8px;border-radius:13px;grid-template-columns:29px 1fr;gap:7px;font-size:11px}.guided-frame>b{width:29px;height:29px}.guided-action{min-height:46px}.step-button{min-width:124px}.guided-complete{padding:8px;font-size:10px}.summary-complete{grid-template-columns:1fr;grid-template-rows:88px minmax(0,1fr);gap:7px}.summary-complete .g4-title-card-stage{min-height:88px}.reflection-card h2{font-size:14px}.reflection-options{gap:5px}.preview-language{top:7px;left:50%;right:auto;transform:translateX(-50%)}}
@media(max-height:700px){.stage-header{padding-top:4px}.stage-chrome{min-height:44px}.stage-content{grid-template-rows:minmax(0,1fr) 34px}.caption-slot{height:34px;min-height:34px}.caption{height:31px;padding:5px 8px}.stage-nav{min-height:56px}.heading{height:52px}.heading .g1-char{width:44px;height:55px}.stack{gap:6px}.model-card,.question,.test-model,.reflection-card{padding:7px}.question-feedback-slot{min-height:78px}.hook-feedback-slot{min-height:48px}.guided-panel{grid-template-rows:7px minmax(52px,1fr) 44px;gap:5px}.guided-action{min-height:44px}.step-button{min-height:44px}.summary-complete{grid-template-rows:82px minmax(0,1fr)}}
@media(prefers-reduced-motion:reduce){.lesson-root *{animation:none!important;transition:none!important}}
.lesson-frame .preview-language{display:none!important}
.lesson-root{font-family:'Manrope',system-ui,sans-serif}.lesson-root h1,.lesson-root [data-g4-role="hook-title"]{font-family:'Source Serif 4',Georgia,serif!important;font-size:clamp(26px,4.2vw,36px)!important;line-height:1.06;text-align:left}.lesson-root .question h2,.lesson-root [data-g4-role="hook-question"]{font-family:'Manrope',system-ui,sans-serif!important;font-size:clamp(17px,2.5vw,21px)!important;line-height:1.25;text-align:left}.lesson-root .lead{font-family:'Manrope',system-ui,sans-serif;font-size:clamp(14px,1.8vw,16px);line-height:1.55}.lesson-root .body-copy{font-family:'Manrope',system-ui,sans-serif;font-size:clamp(15px,2vw,18px);line-height:1.5}.lesson-root .screen-count,.lesson-root [class*="formula"],.lesson-root [class*="equation"],.lesson-root .proof-label{font-family:'JetBrains Mono',monospace!important}
.stage-hook .hook-stack{height:100%;grid-template-rows:auto minmax(206px,1fr) auto;gap:10px}.stage-hook .hook-intro{width:min(760px,100%);margin:0 auto;display:grid;gap:5px;text-align:left}.stage-hook [data-g4-role="hook-topic"]{color:${T.cyan};font:900 11px/1.2 'Manrope',system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase}.stage-hook [data-g4-role="hook-scene"]{width:min(760px,100%);min-height:206px;margin:0 auto;padding:0;border:0;border-radius:24px;overflow:hidden;background:transparent;box-shadow:none}.stage-hook [data-g4-role="visual-frame"]{position:relative;isolation:isolate;width:100%;height:100%;min-height:206px;overflow:hidden;border:1px solid rgba(144,228,235,.12);border-radius:24px;background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%);box-shadow:0 22px 50px -30px rgba(14,33,44,.75)}.stage-hook .hook-visual-content{position:relative;z-index:1;width:100%;height:100%;min-width:0;min-height:206px;padding:12px 154px 12px 12px;display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);align-items:center;gap:12px;overflow:hidden}.stage-hook .hook-visual-content>*{min-width:0;max-width:100%;max-height:182px;overflow:hidden}.stage-hook .hook-visual-content svg,.stage-hook .hook-visual-content img{display:block;max-width:100%;max-height:100%;object-fit:contain}.stage-hook [data-g4-role="hook-bit"]{position:absolute;z-index:2;width:88px;height:110px;right:42px;bottom:-4px;overflow:hidden}.stage-hook [data-g4-role="hook-bit"] .g1-char{width:100%;height:100%}.stage-hook .hook-answers{height:auto;min-height:0;padding:10px 14px;grid-template-rows:auto minmax(0,1fr);gap:8px;overflow:hidden}
.lesson-root .topic-visual,.lesson-root .conversion-visual,.lesson-root .model-card,.lesson-root .test-model{max-width:100%;overflow:hidden}.lesson-root .topic-visual>svg,.lesson-root .conversion-visual>svg{display:block;max-width:100%;max-height:100%;object-fit:contain}.lesson-root [data-g4-role~="feedback-frame"],.lesson-root .question-feedback-slot .feedback{min-height:88px;padding:8px 15px 8px 9px;border-radius:18px;display:grid;grid-template-columns:62px minmax(0,1fr);align-items:center;gap:13px;overflow:hidden;font-family:'Manrope',system-ui,sans-serif;font-size:14px;line-height:1.42}.lesson-root [data-g4-feedback="wrong"],.lesson-root [data-g4-feedback="retry"],.lesson-root .feedback.wrong{color:#A96F13;background:linear-gradient(135deg,#FFF,#FFF5D9);box-shadow:inset 4px 0 #A96F13}.lesson-root [data-g4-feedback="correct"],.lesson-root [data-g4-feedback="solution"],.lesson-root .feedback.correct{color:#227A53;background:linear-gradient(135deg,#FFF,#E7F3EC);box-shadow:inset 4px 0 #227A53}.lesson-root [data-g4-feedback="solution"]{min-height:72px;border-radius:15px;grid-template-columns:51px minmax(0,1fr)}.lesson-root [data-g4-role="feedback-bit"],.lesson-root .feedback>.feedback-bit{width:62px;height:76px;min-width:0;max-width:100%;overflow:hidden}.lesson-root [data-g4-role="feedback-bit"] .feedback-bit{width:100%;height:100%}.lesson-root [data-g4-feedback="solution"]>[data-g4-role="feedback-bit"],.lesson-root [data-g4-feedback="solution"]>.feedback-bit{width:51px;height:64px}.lesson-root [data-g4-role="feedback-bit"] svg{display:block;max-width:100%;max-height:100%}
@media(max-width:639.98px){.lesson-root h1,.lesson-root [data-g4-role="hook-title"]{font-size:25px!important}.stage-hook .hook-stack{grid-template-rows:auto minmax(164px,1fr) auto}.stage-hook [data-g4-role="hook-scene"],.stage-hook [data-g4-role="visual-frame"]{min-height:164px;border-radius:18px}.stage-hook .hook-visual-content{min-height:164px;padding:9px 88px 9px 9px;grid-template-columns:minmax(0,.65fr) minmax(82px,.35fr);grid-template-rows:minmax(0,1fr);align-items:stretch;gap:6px}.stage-hook .hook-visual-content>*{height:146px;max-height:146px;overflow:hidden}.stage-hook .hook-model{position:relative;min-width:0;min-height:0}.stage-hook .hook-model>.topic-visual,.stage-hook .hook-model>.conversion-visual{position:absolute;inset:0 auto auto 0;min-height:0;max-width:none;padding:4px;transform-origin:top left}.stage-hook .hook-model>.topic-visual{width:142.858%;height:142.858%;transform:scale(.7)}.stage-hook .hook-model>.conversion-visual{width:166.667%;height:166.667%;transform:scale(.6)}.stage-hook .hook-model>.topic-visual svg,.stage-hook .hook-model>.conversion-visual svg{max-height:100%}.stage-hook .reveal-grid{height:146px;min-height:0;max-height:none;align-content:center;gap:0;overflow:hidden}.stage-hook .reveal-card{display:none;min-height:0;padding:5px 6px;border-radius:10px;grid-template-columns:1fr;align-content:center;gap:4px;font-size:9px;line-height:1.18;overflow:hidden}.stage-hook .reveal-card[data-current="true"]{display:grid}.stage-hook .reveal-card>b{width:21px;height:21px;border-radius:7px;font-size:8px}.stage-hook .reveal-card>span{overflow-wrap:anywhere}.stage-hook [data-g4-role="hook-bit"]{width:68px;height:85px;right:12px;bottom:-7px}.lesson-root [data-g4-role~="feedback-frame"],.lesson-root .question-feedback-slot .feedback{grid-template-columns:54px minmax(0,1fr)}.lesson-root [data-g4-role="feedback-bit"],.lesson-root .feedback>.feedback-bit{width:54px;height:68px}.lesson-root [data-g4-feedback="solution"]{min-height:68px;border-radius:15px;grid-template-columns:47px minmax(0,1fr)}.lesson-root [data-g4-feedback="solution"]>[data-g4-role="feedback-bit"],.lesson-root [data-g4-feedback="solution"]>.feedback-bit{width:47px;height:59px}}
`;
