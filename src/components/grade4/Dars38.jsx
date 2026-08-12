import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// 4-sinf · Dars 38 · Geometrik yasashlar
// 15 ekran · boshqariladigan audio · har bir mazmunli harakat yakunlangach navigatsiya ochiladi.
const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};
const FRAME_COUNTS = [3, 4, 4, 4, 4, 4, 4, 5, 2, 2, 2, 2, 2, 3, 5];
const TOTAL_SCREENS = FRAME_COUNTS.length;
const LESSON_META = { lessonId: "geometry-4-38-v1", slug: "dars38-geometrik-yasashlar", lessonTitle: {"uz":"Geometrik yasashlar","ru":"Геометрические построения","en":"Geometric constructions"}, skillTags: ["ruler","set-square","protractor","construction"] };
const LESSON_REWARD_TITLE = {
  "uz": "Aniq yasash ustasi",
  "ru": "Мастер точных построений",
  "en": "Precision construction expert"
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
      "uz": "Chizma missiyasi",
      "ru": "Миссия чертежа",
      "en": "Drawing mission"
    },
    "title": {
      "uz": "Bitta asbob yetadimi?",
      "ru": "Достаточно одного инструмента?",
      "en": "Is one tool enough?"
    },
    "scene": "hook",
    "closedSet": true,
    "frames": [
      {
        "uz": "7 cm kesma yasash kerak.",
        "ru": "Нужно построить отрезок длиной 7 см.",
        "en": "A 7 cm segment must be constructed."
      },
      {
        "uz": "Perpendikulyar va 65° burchak ham kerak.",
        "ru": "Также нужны перпендикуляр и угол 65°.",
        "en": "A perpendicular and a 65° angle are also needed."
      },
      {
        "uz": "Qaysi asboblar kerak?",
        "ru": "Какие инструменты понадобятся?",
        "en": "Which tools are needed?"
      }
    ],
    "question": {
      "uz": "Qaysi asboblar barcha yasashlarni aniq bajaradi?",
      "ru": "Какие инструменты позволят точно выполнить все построения?",
      "en": "Which tools will complete every construction accurately?"
    },
    "options": [
      {
        "uz": "Faqat chizg'ich",
        "ru": "Только линейка",
        "en": "A ruler only"
      },
      {
        "uz": "Chizg'ich, go'niya va transportir",
        "ru": "Линейка, угольник и транспортир",
        "en": "A ruler, a set square and a protractor"
      },
      {
        "uz": "Faqat go'niya",
        "ru": "Только угольник",
        "en": "A set square only"
      }
    ],
    "neutral": {
      "uz": "Taxmin saqlandi. Har bir asbobning vazifasini tekshiramiz.",
      "ru": "Гипотеза сохранена. Проверим назначение каждого инструмента.",
      "en": "Estimate saved. We will check the purpose of each tool."
    },
    "audio": {
      "intro": {
        "uz": [
          "Yetti santimetr kesma yasash kerak.",
          "Perpendikulyar va oltmish besh daraja burchak ham kerak.",
          "Qaysi asboblar kerak?"
        ],
        "ru": [
          "Нужно построить отрезок длиной семь сантиметров.",
          "Также нужны перпендикуляр и угол шестьдесят пять градусов.",
          "Какие инструменты понадобятся?"
        ],
        "en": [
          "A seven-centimetre segment must be constructed.",
          "A perpendicular and a sixty-five-degree angle are also needed.",
          "Which tools are needed?"
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
      "uz": "Chizg'ichning ikki vazifasi",
      "ru": "Две функции линейки",
      "en": "Two jobs of a ruler"
    },
    "scene": "ruler",
    "frames": [
      {
        "uz": "Chizg'ich to'g'ri chiziq o'tkazadi.",
        "ru": "Линейка проводит прямую линию.",
        "en": "A ruler draws a straight line."
      },
      {
        "uz": "Shkala uzunlikni o'lchaydi.",
        "ru": "Шкала измеряет длину.",
        "en": "The scale measures length."
      },
      {
        "uz": "O'lchashni 0 belgisidan boshlang.",
        "ru": "Начинайте измерение от отметки 0.",
        "en": "Start measuring at the 0 mark."
      },
      {
        "uz": "Yakunida uzunlikni qayta o'lchang.",
        "ru": "В конце измерьте длину ещё раз.",
        "en": "Measure the length again at the end."
      }
    ],
    "audio": {
      "uz": [
        "Chizg'ich to'g'ri chiziq o'tkazadi.",
        "Shkala uzunlikni o'lchaydi.",
        "O'lchashni nol belgisidan boshlang.",
        "Yakunida uzunlikni qayta o'lchang."
      ],
      "ru": [
        "Линейка проводит прямую линию.",
        "Шкала измеряет длину.",
        "Начинайте измерение от отметки ноль.",
        "В конце измерьте длину ещё раз."
      ],
      "en": [
        "A ruler draws a straight line.",
        "The scale measures length.",
        "Start measuring at the zero mark.",
        "Measure the length again at the end."
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
      "uz": "7 cm kesma",
      "ru": "Отрезок 7 см",
      "en": "A 7 cm segment"
    },
    "scene": "segment",
    "frames": [
      {
        "uz": "A nuqtani belgilang.",
        "ru": "Отметьте точку A.",
        "en": "Mark point A."
      },
      {
        "uz": "Chizg'ichning 0 belgisini A nuqtaga qo'ying.",
        "ru": "Совместите отметку 0 линейки с точкой A.",
        "en": "Place the ruler's 0 mark at point A."
      },
      {
        "uz": "7 cm joyda B nuqtani belgilang.",
        "ru": "У отметки 7 см поставьте точку B.",
        "en": "Mark point B at 7 cm."
      },
      {
        "uz": "Nuqtalarni tutashtiring: AB = 7 cm.",
        "ru": "Соедините точки: AB = 7 см.",
        "en": "Join the points: AB = 7 cm."
      }
    ],
    "audio": {
      "uz": [
        "A nuqtani belgilang.",
        "Chizg'ichning nol belgisini A nuqtaga qo'ying.",
        "Yetti santimetr joyda B nuqtani belgilang.",
        "Nuqtalarni tutashtiring: AB teng yetti santimetr."
      ],
      "ru": [
        "Отметьте точку A.",
        "Совместите отметку ноль линейки с точкой A.",
        "У отметки семь сантиметров поставьте точку B.",
        "Соедините точки: AB равно семь сантиметров."
      ],
      "en": [
        "Mark point A.",
        "Place the ruler's zero mark at point A.",
        "Mark point B at seven centimetres.",
        "Join the points: AB equals seven centimetres."
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
      "uz": "Go'niya",
      "ru": "Угольник",
      "en": "Set square"
    },
    "scene": "set-square",
    "frames": [
      {
        "uz": "Go'niya to'g'ri burchak yasaydi.",
        "ru": "Угольник строит прямой угол.",
        "en": "A set square constructs a right angle."
      },
      {
        "uz": "To'g'ri burchak 90° ga teng.",
        "ru": "Прямой угол равен 90°.",
        "en": "A right angle is 90°."
      },
      {
        "uz": "Bir tomonini berilgan chiziqqa moslang.",
        "ru": "Совместите одну сторону угольника с данной прямой.",
        "en": "Align one side of the set square with the given line."
      },
      {
        "uz": "Ikkinchi tomoni kerakli yo'nalishni beradi.",
        "ru": "Другая сторона задаёт нужное направление.",
        "en": "The other side gives the required direction."
      }
    ],
    "audio": {
      "uz": [
        "Go'niya to'g'ri burchak yasaydi.",
        "To'g'ri burchak to'qson darajaga teng.",
        "Bir tomonini berilgan chiziqqa moslang.",
        "Ikkinchi tomoni kerakli yo'nalishni beradi."
      ],
      "ru": [
        "Угольник строит прямой угол.",
        "Прямой угол равен девяноста градусам.",
        "Совместите одну сторону угольника с данной прямой.",
        "Другая сторона задаёт нужное направление."
      ],
      "en": [
        "A set square constructs a right angle.",
        "A right angle is ninety degrees.",
        "Align one side of the set square with the given line.",
        "The other side gives the required direction."
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
      "uz": "Perpendikulyar",
      "ru": "Перпендикуляр",
      "en": "Perpendicular"
    },
    "scene": "perpendicular",
    "frames": [
      {
        "uz": "Berilgan chiziqni ko'ring.",
        "ru": "Рассмотрите данную прямую.",
        "en": "Look at the given line."
      },
      {
        "uz": "Undagi P nuqtani belgilang.",
        "ru": "Отметьте на ней точку P.",
        "en": "Mark point P on it."
      },
      {
        "uz": "Go'niyani P nuqtada chiziqqa moslang.",
        "ru": "Совместите угольник с прямой в точке P.",
        "en": "Align the set square with the line at point P."
      },
      {
        "uz": "P dan 90° li chiziq o'tkazing.",
        "ru": "Проведите через P линию под углом 90°.",
        "en": "Draw a 90° line through P."
      }
    ],
    "audio": {
      "uz": [
        "Berilgan chiziqni ko'ring.",
        "Undagi P nuqtani belgilang.",
        "Go'niyani P nuqtada chiziqqa moslang.",
        "P dan to'qson darajali chiziq o'tkazing."
      ],
      "ru": [
        "Рассмотрите данную прямую.",
        "Отметьте на ней точку P.",
        "Совместите угольник с прямой в точке P.",
        "Проведите через точку P линию под углом девяноста градусов."
      ],
      "en": [
        "Look at the given line.",
        "Mark point P on it.",
        "Align the set square with the line at point P.",
        "Draw a ninety-degree line through P."
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
      "uz": "Parallel",
      "ru": "Параллель",
      "en": "Parallel"
    },
    "scene": "parallel",
    "frames": [
      {
        "uz": "Asos chiziqni chizg'ich bilan chizing.",
        "ru": "Проведите исходную прямую линейкой.",
        "en": "Draw the base line with a ruler."
      },
      {
        "uz": "Go'niyani chizg'ichga tirang.",
        "ru": "Прижмите угольник к линейке.",
        "en": "Place the set square against the ruler."
      },
      {
        "uz": "Yo'nalishni o'zgartirmay go'niyani suring.",
        "ru": "Сдвиньте угольник, не меняя его направления.",
        "en": "Slide the set square without changing its direction."
      },
      {
        "uz": "Go'niya bo'ylab parallel chiziq chizing.",
        "ru": "Проведите по угольнику параллельную прямую.",
        "en": "Draw a parallel line along the set square."
      }
    ],
    "audio": {
      "uz": [
        "Asos chiziqni chizg'ich bilan chizing.",
        "Go'niyani chizg'ichga tirang.",
        "Yo'nalishni o'zgartirmay go'niyani suring.",
        "Go'niya bo'ylab parallel chiziq chizing."
      ],
      "ru": [
        "Проведите исходную прямую линейкой.",
        "Прижмите угольник к линейке.",
        "Сдвиньте угольник, не меняя его направления.",
        "Проведите по угольнику параллельную прямую."
      ],
      "en": [
        "Draw the base line with a ruler.",
        "Place the set square against the ruler.",
        "Slide the set square without changing its direction.",
        "Draw a parallel line along the set square."
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
      "uz": "Transportirni joylashtirish",
      "ru": "Размещение транспортира",
      "en": "Positioning a protractor"
    },
    "scene": "protractor",
    "frames": [
      {
        "uz": "Transportir markazini burchak uchiga qo'ying.",
        "ru": "Поместите центр транспортира на вершину угла.",
        "en": "Place the protractor centre on the angle vertex."
      },
      {
        "uz": "Transportir asosini boshlang'ich nurga moslang.",
        "ru": "Совместите основание транспортира с начальным лучом.",
        "en": "Align the protractor baseline with the starting ray."
      },
      {
        "uz": "Nurning qaysi tomonda ekaniga qarab 0° shkalani tanlang.",
        "ru": "Выберите шкалу 0° со стороны луча.",
        "en": "Choose the 0° scale on the ray side."
      },
      {
        "uz": "Kerakli darajani belgilang.",
        "ru": "Отметьте нужное число градусов.",
        "en": "Mark the required degree measure."
      }
    ],
    "audio": {
      "uz": [
        "Transportir markazini burchak uchiga qo'ying.",
        "Transportir asosini boshlang'ich nurga moslang.",
        "Nurning qaysi tomonda ekaniga qarab nol daraja shkalani tanlang.",
        "Kerakli darajani belgilang."
      ],
      "ru": [
        "Поместите центр транспортира на вершину угла.",
        "Совместите основание транспортира с начальным лучом.",
        "Выберите шкалу ноль градусов со стороны луча.",
        "Отметьте нужное число градусов."
      ],
      "en": [
        "Place the protractor centre on the angle vertex.",
        "Align the protractor baseline with the starting ray.",
        "Choose the zero-degree scale on the ray side.",
        "Mark the required degree measure."
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
      "uz": "65° yasash",
      "ru": "Построение 65°",
      "en": "Constructing 65°"
    },
    "scene": "angle-build",
    "frames": [
      {
        "uz": "Boshlang'ich nurni chizing.",
        "ru": "Проведите начальный луч.",
        "en": "Draw the starting ray."
      },
      {
        "uz": "Markaz va asosni nurga moslang.",
        "ru": "Совместите центр и основание с лучом.",
        "en": "Align the centre and baseline with the ray."
      },
      {
        "uz": "65° belgisini qo'ying.",
        "ru": "Поставьте отметку 65°.",
        "en": "Make the 65° mark."
      },
      {
        "uz": "Uchdan belgi orqali ikkinchi nurni chizing.",
        "ru": "Проведите второй луч от вершины через отметку.",
        "en": "Draw the second ray from the vertex through the mark."
      },
      {
        "uz": "Asboblar: chizg'ich, go'niya va transportir.",
        "ru": "Инструменты: линейка, угольник и транспортир.",
        "en": "Tools: ruler, set square and protractor."
      }
    ],
    "audio": {
      "uz": [
        "Boshlang'ich nurni chizing.",
        "Markaz va asosni nurga moslang.",
        "Oltmish besh daraja belgisini qo'ying.",
        "Uchdan belgi orqali ikkinchi nurni chizing.",
        "Demak kesma uchun chizg'ich, perpendikulyar uchun go'niya, burchak uchun transportir kerak."
      ],
      "ru": [
        "Проведите начальный луч.",
        "Совместите центр и основание с лучом.",
        "Поставьте отметку шестьдесят пять градусов.",
        "Проведите второй луч от вершины через отметку.",
        "Итак, для отрезка нужна линейка, для перпендикуляра угольник, для угла транспортир."
      ],
      "en": [
        "Draw the starting ray.",
        "Align the centre and baseline with the ray.",
        "Make the sixty-five-degree mark.",
        "Draw the second ray from the vertex through the mark.",
        "Therefore, the segment needs a ruler, the perpendicular needs a set square, and the angle needs a protractor."
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
      "uz": "7 cm uchun asbob",
      "ru": "Инструмент для 7 см",
      "en": "Tool for 7 cm"
    },
    "scene": "length-tool",
    "closedSet": true,
    "frames": [
      {
        "uz": "7 cm kesma yasash kerak.",
        "ru": "Нужно построить отрезок длиной 7 см.",
        "en": "A 7 cm segment must be constructed."
      },
      {
        "uz": "Uzunlikni o'lchaydigan asbobni tanlang.",
        "ru": "Выберите инструмент для измерения длины.",
        "en": "Choose the tool that measures length."
      }
    ],
    "question": {
      "uz": "7 cm kesma uchun qaysi asbob kerak?",
      "ru": "Какой инструмент нужен для отрезка длиной 7 см?",
      "en": "Which tool is needed for a 7 cm segment?"
    },
    "options": [
      {
        "uz": "Chizg'ich",
        "ru": "Линейка",
        "en": "Ruler"
      },
      {
        "uz": "Go'niya",
        "ru": "Угольник",
        "en": "Set square"
      },
      {
        "uz": "Transportir",
        "ru": "Транспортир",
        "en": "Protractor"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "Chizg'ichning 0 va 7 cm belgilari kesma uzunligini beradi.",
      "ru": "Отметки 0 и 7 см на линейке задают длину отрезка.",
      "en": "The 0 and 7 cm marks on the ruler set the segment length."
    },
    "audio": {
      "intro": {
        "uz": [
          "Yetti santimetr kesma yasash kerak.",
          "Uzunlikni o'lchaydigan asbobni tanlang."
        ],
        "ru": [
          "Нужно построить отрезок длиной семь сантиметров.",
          "Выберите инструмент для измерения длины."
        ],
        "en": [
          "A seven-centimetre segment must be constructed.",
          "Choose the tool that measures length."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Chizg'ichning nol va yetti santimetr belgilari kesma uzunligini beradi.",
        "ru": "Верно. Отметки ноль и семь сантиметров на линейке задают длину отрезка.",
        "en": "Correct. The zero and seven-centimetre marks on the ruler set the segment length."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Chizg'ichning nol va yetti santimetr belgilari kesma uzunligini beradi.",
          "ru": "Верно. Отметки ноль и семь сантиметров на линейке задают длину отрезка.",
          "en": "Correct. The zero and seven-centimetre marks on the ruler set the segment length."
        },
        {
          "uz": "Yana bir qarang: Go'niyaning to'qson darajali burchagi perpendikulyar yasaydi, ammo kesma uzunligini o'lchamaydi. Yetti santimetr uchun chizg'ich shkalasi kerak.",
          "ru": "Посмотрите ещё раз: Угольник задаёт прямой угол, но не измеряет длину отрезка. Для семи сантиметров нужна шкала линейки.",
          "en": "Look again: A set square gives a right angle but does not measure segment length. A seven-centimetre segment needs the ruler scale."
        },
        {
          "uz": "Yana bir qarang: Transportir burchaklarni o'lchaydi, uzunlikni emas. Yetti santimetrni belgilash uchun chizg'ichning chiziqli shkalasi kerak.",
          "ru": "Посмотрите ещё раз: Транспортир измеряет углы, а не длину. Чтобы отметить семь сантиметров, нужна линейная шкала линейки.",
          "en": "Look again: A protractor measures angles, not length. Mark seven centimetres with the linear scale on a ruler."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Chizg'ichning nol va yetti santimetr belgilari kesma uzunligini beradi.",
        "ru": "Верно. Отметки ноль и семь сантиметров на линейке задают длину отрезка.",
        "en": "Correct. The zero and seven-centimetre marks on the ruler set the segment length."
      },
      {
        "uz": "Yana bir qarang: Go'niyaning to'qson darajali burchagi perpendikulyar yasaydi, ammo kesma uzunligini o'lchamaydi. Yetti santimetr uchun chizg'ich shkalasi kerak.",
        "ru": "Посмотрите ещё раз: Угольник задаёт прямой угол, но не измеряет длину отрезка. Для семи сантиметров нужна шкала линейки.",
        "en": "Look again: A set square gives a right angle but does not measure segment length. A seven-centimetre segment needs the ruler scale."
      },
      {
        "uz": "Yana bir qarang: Transportir burchaklarni o'lchaydi, uzunlikni emas. Yetti santimetrni belgilash uchun chizg'ichning chiziqli shkalasi kerak.",
        "ru": "Посмотрите ещё раз: Транспортир измеряет углы, а не длину. Чтобы отметить семь сантиметров, нужна линейная шкала линейки.",
        "en": "Look again: A protractor measures angles, not length. Mark seven centimetres with the linear scale on a ruler."
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
      "uz": "Transportir markazi",
      "ru": "Центр транспортира",
      "en": "Protractor centre"
    },
    "scene": "protractor-centre",
    "closedSet": true,
    "frames": [
      {
        "uz": "Transportir bilan burchak yasaymiz.",
        "ru": "Построим угол транспортиром.",
        "en": "We will construct an angle with a protractor."
      },
      {
        "uz": "Markazning to'g'ri joyini toping.",
        "ru": "Найдите правильное положение центра.",
        "en": "Find the correct position for its centre."
      }
    ],
    "question": {
      "uz": "Transportir markazi qayerga qo'yiladi?",
      "ru": "Куда ставят центр транспортира?",
      "en": "Where is the protractor centre placed?"
    },
    "options": [
      {
        "uz": "Burchak uchiga",
        "ru": "На вершине угла",
        "en": "On the angle vertex"
      },
      {
        "uz": "Nurning o'rtasiga",
        "ru": "В середине луча",
        "en": "In the middle of the ray"
      },
      {
        "uz": "Daraja belgisiga",
        "ru": "На градусной отметке",
        "en": "On the degree mark"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "Transportir markazi burchak uchi bilan ustma-ust turadi.",
      "ru": "Центр транспортира совмещают с вершиной угла.",
      "en": "The protractor centre is aligned with the angle vertex."
    },
    "audio": {
      "intro": {
        "uz": [
          "Transportir bilan burchak yasaymiz.",
          "Markazning to'g'ri joyini toping."
        ],
        "ru": [
          "Построим угол транспортиром.",
          "Найдите правильное положение центра."
        ],
        "en": [
          "We will construct an angle with a protractor.",
          "Find the correct position for its centre."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Transportir markazi burchak uchi bilan ustma-ust turadi.",
        "ru": "Верно. Центр транспортира совмещают с вершиной угла.",
        "en": "Correct. The protractor centre is aligned with the angle vertex."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Transportir markazi burchak uchi bilan ustma-ust turadi.",
          "ru": "Верно. Центр транспортира совмещают с вершиной угла.",
          "en": "Correct. The protractor centre is aligned with the angle vertex."
        },
        {
          "uz": "Yana bir qarang: Markaz nur o'rtasida tursa, o'lchov burchak uchidan boshlanmaydi. Markazni ikki nur uchrashgan nuqtaga qo'ying.",
          "ru": "Посмотрите ещё раз: Если центр находится в середине луча, измерение начинается не от вершины. Совместите центр с точкой встречи лучей.",
          "en": "Look again: Placing the centre midway along a ray starts the measurement away from the vertex. Align it with the point where the rays meet."
        },
        {
          "uz": "Yana bir qarang: Daraja belgisi ikkinchi nur yo'nalishini ko'rsatadi, transportir markazini emas. Markaz burchak uchida turishi kerak.",
          "ru": "Посмотрите ещё раз: Градусная отметка задаёт направление второго луча, а не положение центра. Центр должен находиться на вершине.",
          "en": "Look again: A degree mark locates the second ray, not the protractor centre. The centre must sit on the vertex."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Transportir markazi burchak uchi bilan ustma-ust turadi.",
        "ru": "Верно. Центр транспортира совмещают с вершиной угла.",
        "en": "Correct. The protractor centre is aligned with the angle vertex."
      },
      {
        "uz": "Yana bir qarang: Markaz nur o'rtasida tursa, o'lchov burchak uchidan boshlanmaydi. Markazni ikki nur uchrashgan nuqtaga qo'ying.",
        "ru": "Посмотрите ещё раз: Если центр находится в середине луча, измерение начинается не от вершины. Совместите центр с точкой встречи лучей.",
        "en": "Look again: Placing the centre midway along a ray starts the measurement away from the vertex. Align it with the point where the rays meet."
      },
      {
        "uz": "Yana bir qarang: Daraja belgisi ikkinchi nur yo'nalishini ko'rsatadi, transportir markazini emas. Markaz burchak uchida turishi kerak.",
        "ru": "Посмотрите ещё раз: Градусная отметка задаёт направление второго луча, а не положение центра. Центр должен находиться на вершине.",
        "en": "Look again: A degree mark locates the second ray, not the protractor centre. The centre must sit on the vertex."
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
      "uz": "65° tartibi",
      "ru": "Порядок для 65°",
      "en": "Order for 65°"
    },
    "scene": "angle-order",
    "closedSet": true,
    "frames": [
      {
        "uz": "65° burchak yasash kerak.",
        "ru": "Нужно построить угол 65°.",
        "en": "A 65° angle must be constructed."
      },
      {
        "uz": "Amallar tartibini tanlang.",
        "ru": "Выберите правильный порядок действий.",
        "en": "Choose the correct order."
      }
    ],
    "question": {
      "uz": "Qaysi tartib to'g'ri?",
      "ru": "Какой порядок верный?",
      "en": "Which order is correct?"
    },
    "options": [
      {
        "uz": "Nur → markaz → shkala → belgi → ikkinchi nur",
        "ru": "Луч → центр → шкала → отметка → второй луч",
        "en": "Ray → centre → scale → mark → second ray"
      },
      {
        "uz": "Belgi → nur → markaz → shkala",
        "ru": "Отметка → луч → центр → шкала",
        "en": "Mark → ray → centre → scale"
      },
      {
        "uz": "Ikkinchi nur → belgi → markaz",
        "ru": "Второй луч → отметка → центр",
        "en": "Second ray → mark → centre"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "Avval nur chiziladi, so'ng markaz va shkala moslanib, 65° belgidan ikkinchi nur o'tkaziladi.",
      "ru": "Сначала проводят луч, затем совмещают центр и шкалу и проводят второй луч через отметку 65°.",
      "en": "Draw the ray first, align the centre and scale, then draw the second ray through the 65° mark."
    },
    "audio": {
      "intro": {
        "uz": [
          "Oltmish besh daraja burchak yasash kerak.",
          "Amallar tartibini tanlang."
        ],
        "ru": [
          "Нужно построить угол шестьдесят пять градусов.",
          "Выберите правильный порядок действий."
        ],
        "en": [
          "A sixty-five-degree angle must be constructed.",
          "Choose the correct order."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Avval nur chiziladi, so'ng markaz va shkala moslanib, oltmish besh daraja belgidan ikkinchi nur o'tkaziladi.",
        "ru": "Верно. Сначала проведите луч. Затем совместите центр и шкалу, поставьте отметку шестьдесят пять градусов и проведите второй луч.",
        "en": "Correct. Draw the ray, align the centre and scale, mark sixty-five degrees, then draw the second ray through the mark."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Avval nur chiziladi, so'ng markaz va shkala moslanib, oltmish besh daraja belgidan ikkinchi nur o'tkaziladi.",
          "ru": "Верно. Сначала проведите луч. Затем совместите центр и шкалу, поставьте отметку шестьдесят пять градусов и проведите второй луч.",
          "en": "Correct. Draw the ray, align the centre and scale, mark sixty-five degrees, then draw the second ray through the mark."
        },
        {
          "uz": "Yana bir qarang: Boshlang'ich nur va transportir markazi bo'lmasa, belgining qaysi noldan o'lchangani noma'lum. Avval nurni chizing va asbobni moslang.",
          "ru": "Посмотрите ещё раз: Без начального луча и совмещённого центра непонятно, от какого нуля отмерена отметка. Сначала проведите луч и расположите транспортир.",
          "en": "Look again: Without a starting ray and aligned centre, the mark has no zero reference. Draw the ray and position the protractor first."
        },
        {
          "uz": "Yana bir qarang: Ikkinchi nur avval chizilsa, oltmish besh darajali yo'nalish hali belgilanmagan bo'ladi. Avval o'lchang, keyin ikkinchi nurni chizing.",
          "ru": "Посмотрите ещё раз: Если провести второй луч сначала, направление в шестьдесят пять градусов ещё не отмечено. Сначала измерьте угол, затем проведите луч.",
          "en": "Look again: Drawing the second ray first gives it no sixty-five-degree target. Measure and mark the angle before drawing that ray."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Avval nur chiziladi, so'ng markaz va shkala moslanib, oltmish besh daraja belgidan ikkinchi nur o'tkaziladi.",
        "ru": "Верно. Сначала проведите луч. Затем совместите центр и шкалу, поставьте отметку шестьдесят пять градусов и проведите второй луч.",
        "en": "Correct. Draw the ray, align the centre and scale, mark sixty-five degrees, then draw the second ray through the mark."
      },
      {
        "uz": "Yana bir qarang: Boshlang'ich nur va transportir markazi bo'lmasa, belgining qaysi noldan o'lchangani noma'lum. Avval nurni chizing va asbobni moslang.",
        "ru": "Посмотрите ещё раз: Без начального луча и совмещённого центра непонятно, от какого нуля отмерена отметка. Сначала проведите луч и расположите транспортир.",
        "en": "Look again: Without a starting ray and aligned centre, the mark has no zero reference. Draw the ray and position the protractor first."
      },
      {
        "uz": "Yana bir qarang: Ikkinchi nur avval chizilsa, oltmish besh darajali yo'nalish hali belgilanmagan bo'ladi. Avval o'lchang, keyin ikkinchi nurni chizing.",
        "ru": "Посмотрите ещё раз: Если провести второй луч сначала, направление в шестьдесят пять градусов ещё не отмечено. Сначала измерьте угол, затем проведите луч.",
        "en": "Look again: Drawing the second ray first gives it no sixty-five-degree target. Measure and mark the angle before drawing that ray."
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
      "uz": "Nuqtadan perpendikulyar",
      "ru": "Перпендикуляр через точку",
      "en": "Perpendicular through a point"
    },
    "scene": "perpendicular-tool",
    "closedSet": true,
    "frames": [
      {
        "uz": "Nuqtadan perpendikulyar o'tkazish kerak.",
        "ru": "Через точку нужно провести перпендикуляр.",
        "en": "A perpendicular must be drawn through a point."
      },
      {
        "uz": "90° yo'nalishni beradigan asbobni tanlang.",
        "ru": "Выберите инструмент, который задаёт направление 90°.",
        "en": "Choose the tool that gives a 90° direction."
      }
    ],
    "question": {
      "uz": "Qaysi asbobdan foydalanamiz?",
      "ru": "Какой инструмент удобнее всего?",
      "en": "Which tool is most suitable?"
    },
    "options": [
      {
        "uz": "Go'niya",
        "ru": "Угольник",
        "en": "Set square"
      },
      {
        "uz": "Faqat transportir",
        "ru": "Только транспортир",
        "en": "Protractor only"
      },
      {
        "uz": "Faqat sirkul",
        "ru": "Только циркуль",
        "en": "Compasses only"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "Go'niyaning 90° burchagi perpendikulyar yo'nalishni beradi.",
      "ru": "Угол 90° угольника задаёт перпендикулярное направление.",
      "en": "The set square's 90° corner gives the perpendicular direction."
    },
    "audio": {
      "intro": {
        "uz": [
          "Nuqtadan perpendikulyar o'tkazish kerak.",
          "To'qson daraja yo'nalishni beradigan asbobni tanlang."
        ],
        "ru": [
          "Через точку нужно провести перпендикуляр.",
          "Выберите инструмент, который задаёт направление девяносто градусов."
        ],
        "en": [
          "A perpendicular must be drawn through a point.",
          "Choose the tool that gives a ninety-degree direction."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Go'niyaning to'qson daraja burchagi perpendikulyar yo'nalishni beradi.",
        "ru": "Верно. Прямой угол угольника задаёт перпендикулярное направление.",
        "en": "Correct. The set square's ninety-degree corner gives the perpendicular direction."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Go'niyaning to'qson daraja burchagi perpendikulyar yo'nalishni beradi.",
          "ru": "Верно. Прямой угол угольника задаёт перпендикулярное направление.",
          "en": "Correct. The set square's ninety-degree corner gives the perpendicular direction."
        },
        {
          "uz": "Yana bir qarang: Transportir bilan to'qson darajani o'lchash va keyin chiziq o'tkazish uchun yana chizg'ich kerak. Go'niya tayyor perpendikulyar yo'nalishni beradi.",
          "ru": "Посмотрите ещё раз: После отметки девяноста градусов транспортиром понадобится линейка. Угольник сразу задаёт точное перпендикулярное направление.",
          "en": "Look again: A protractor mark still needs a ruler to draw the line. A set square directly provides the perpendicular direction."
        },
        {
          "uz": "Yana bir qarang: Sirkul aylana va yoy chizadi, lekin tayyor to'qson darajali yo'nalish bermaydi. Nuqtadan perpendikulyar uchun go'niyani tanlang.",
          "ru": "Посмотрите ещё раз: Циркуль строит окружности и дуги, но не задаёт готовое направление в девяносто градусов. Выберите угольник.",
          "en": "Look again: Compasses draw circles and arcs but provide no fixed ninety-degree direction. Use the set square for the perpendicular."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Go'niyaning to'qson daraja burchagi perpendikulyar yo'nalishni beradi.",
        "ru": "Верно. Прямой угол угольника задаёт перпендикулярное направление.",
        "en": "Correct. The set square's ninety-degree corner gives the perpendicular direction."
      },
      {
        "uz": "Yana bir qarang: Transportir bilan to'qson darajani o'lchash va keyin chiziq o'tkazish uchun yana chizg'ich kerak. Go'niya tayyor perpendikulyar yo'nalishni beradi.",
        "ru": "Посмотрите ещё раз: После отметки девяноста градусов транспортиром понадобится линейка. Угольник сразу задаёт точное перпендикулярное направление.",
        "en": "Look again: A protractor mark still needs a ruler to draw the line. A set square directly provides the perpendicular direction."
      },
      {
        "uz": "Yana bir qarang: Sirkul aylana va yoy chizadi, lekin tayyor to'qson darajali yo'nalish bermaydi. Nuqtadan perpendikulyar uchun go'niyani tanlang.",
        "ru": "Посмотрите ещё раз: Циркуль строит окружности и дуги, но не задаёт готовое направление в девяносто градусов. Выберите угольник.",
        "en": "Look again: Compasses draw circles and arcs but provide no fixed ninety-degree direction. Use the set square for the perpendicular."
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
      "uz": "Parallel chiziqda nima saqlanadi?",
      "ru": "Что сохраняется при построении параллели?",
      "en": "What stays unchanged when drawing a parallel?"
    },
    "scene": "parallel-direction",
    "closedSet": true,
    "frames": [
      {
        "uz": "Go'niya chizg'ich bo'ylab suriladi.",
        "ru": "Угольник скользит вдоль линейки.",
        "en": "The set square slides along the ruler."
      },
      {
        "uz": "Parallel chiziq uchun bir xususiyat saqlanadi.",
        "ru": "Для параллельной прямой одно свойство сохраняется.",
        "en": "One property stays unchanged for a parallel line."
      }
    ],
    "question": {
      "uz": "Nima o'zgarmasligi kerak?",
      "ru": "Что должно сохраняться?",
      "en": "What must stay unchanged?"
    },
    "options": [
      {
        "uz": "Go'niyaning yo'nalishi",
        "ru": "Направление угольника",
        "en": "The direction of the set square"
      },
      {
        "uz": "Chiziqning uzunligi",
        "ru": "Длина прямой",
        "en": "The length of the line"
      },
      {
        "uz": "Transportir shkalasi",
        "ru": "Шкала транспортира",
        "en": "The protractor scale"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "Go'niya surilganda uning yo'nalishi o'zgarmasa, chiziqlar parallel bo'ladi.",
      "ru": "Если направление угольника при сдвиге не меняется, прямые параллельны.",
      "en": "If the set square keeps its direction while sliding, the lines are parallel."
    },
    "audio": {
      "intro": {
        "uz": [
          "Go'niya chizg'ich bo'ylab suriladi.",
          "Parallel chiziq uchun bir xususiyat saqlanadi."
        ],
        "ru": [
          "Угольник скользит вдоль линейки.",
          "Для параллельной прямой одно свойство сохраняется."
        ],
        "en": [
          "The set square slides along the ruler.",
          "One property stays unchanged for a parallel line."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Go'niya surilganda uning yo'nalishi o'zgarmasa, chiziqlar parallel bo'ladi.",
        "ru": "Верно. Если направление угольника при сдвиге не меняется, прямые параллельны.",
        "en": "Correct. If the set square keeps its direction while sliding, the lines are parallel."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Go'niya surilganda uning yo'nalishi o'zgarmasa, chiziqlar parallel bo'ladi.",
          "ru": "Верно. Если направление угольника при сдвиге не меняется, прямые параллельны.",
          "en": "Correct. If the set square keeps its direction while sliding, the lines are parallel."
        },
        {
          "uz": "Yana bir qarang: Ko'rinadigan kesmalar uzunligi turlicha bo'lsa ham, chiziqlar parallel bo'lishi mumkin. Muhimi, go'niya yo'nalishini o'zgartirmaslik.",
          "ru": "Посмотрите ещё раз: Видимые отрезки могут иметь разную длину и оставаться параллельными. Важно не менять направление угольника.",
          "en": "Look again: Visible segments may have different lengths and still be parallel. What matters is keeping the set square in the same direction."
        },
        {
          "uz": "Yana bir qarang: Transportir shkalasi burchakni o'lchaydi. Parallel chiziq yasashda esa go'niya o'zgarmas yo'nalishda siljishi kerak.",
          "ru": "Посмотрите ещё раз: Шкала транспортира измеряет угол. При построении параллели угольник должен скользить, не меняя направления.",
          "en": "Look again: A protractor scale measures an angle. To draw a parallel, slide the set square without changing its direction."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Go'niya surilganda uning yo'nalishi o'zgarmasa, chiziqlar parallel bo'ladi.",
        "ru": "Верно. Если направление угольника при сдвиге не меняется, прямые параллельны.",
        "en": "Correct. If the set square keeps its direction while sliding, the lines are parallel."
      },
      {
        "uz": "Yana bir qarang: Ko'rinadigan kesmalar uzunligi turlicha bo'lsa ham, chiziqlar parallel bo'lishi mumkin. Muhimi, go'niya yo'nalishini o'zgartirmaslik.",
        "ru": "Посмотрите ещё раз: Видимые отрезки могут иметь разную длину и оставаться параллельными. Важно не менять направление угольника.",
        "en": "Look again: Visible segments may have different lengths and still be parallel. What matters is keeping the set square in the same direction."
      },
      {
        "uz": "Yana bir qarang: Transportir shkalasi burchakni o'lchaydi. Parallel chiziq yasashda esa go'niya o'zgarmas yo'nalishda siljishi kerak.",
        "ru": "Посмотрите ещё раз: Шкала транспортира измеряет угол. При построении параллели угольник должен скользить, не меняя направления.",
        "en": "Look again: A protractor scale measures an angle. To draw a parallel, slide the set square without changing its direction."
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
      "uz": "Chizma rejasi",
      "ru": "План построения",
      "en": "Construction plan"
    },
    "scene": "construction-plan",
    "closedSet": true,
    "frames": [
      {
        "uz": "AB=6 cm kesma yasang.",
        "ru": "Постройте отрезок AB = 6 см.",
        "en": "Construct segment AB = 6 cm."
      },
      {
        "uz": "A dan perpendikulyar, B dan parallel chiziq o'tkazing.",
        "ru": "Через A проведите перпендикуляр, через B — параллельную прямую.",
        "en": "Draw a perpendicular through A and a parallel line through B."
      },
      {
        "uz": "Asboblar tartibini tekshiring.",
        "ru": "Проверьте порядок инструментов.",
        "en": "Check the order of the tools."
      }
    ],
    "question": {
      "uz": "Qaysi reja to'g'ri?",
      "ru": "Какой план верный?",
      "en": "Which plan is correct?"
    },
    "options": [
      {
        "uz": "Chizg'ich → go'niya → chizg'ich bilan tekshirish",
        "ru": "Линейка → угольник → проверка линейкой",
        "en": "Ruler → set square → check with ruler"
      },
      {
        "uz": "Transportir → sirkul → go'niya",
        "ru": "Транспортир → циркуль → угольник",
        "en": "Protractor → compasses → set square"
      },
      {
        "uz": "Go'niya → transportir → sirkul",
        "ru": "Угольник → транспортир → циркуль",
        "en": "Set square → protractor → compasses"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "Chizg'ich kesmani yasaydi, go'niya ikki yo'nalishni beradi, chizg'ich esa natijani tekshiradi.",
      "ru": "Линейка строит отрезок, угольник задаёт два направления, а линейка проверяет результат.",
      "en": "The ruler constructs the segment, the set square gives both directions, and the ruler verifies the construction."
    },
    "audio": {
      "intro": {
        "uz": [
          "AB teng olti santimetr kesma yasang.",
          "A dan perpendikulyar, B dan parallel chiziq o'tkazing.",
          "Asboblar tartibini tekshiring."
        ],
        "ru": [
          "Постройте отрезок AB равно шесть сантиметров.",
          "Через A проведите перпендикуляр, через B, параллельную прямую.",
          "Проверьте порядок инструментов."
        ],
        "en": [
          "Construct segment AB equals six centimetres.",
          "Draw a perpendicular through A and a parallel line through B.",
          "Check the order of the tools."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Chizg'ich kesmani yasaydi, go'niya ikki yo'nalishni beradi, chizg'ich esa natijani tekshiradi.",
        "ru": "Верно. Линейка строит отрезок, угольник задаёт два направления, а линейка проверяет результат.",
        "en": "Correct. Use the ruler for the segment, the set square for both directions, then the ruler to check the construction."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Chizg'ich kesmani yasaydi, go'niya ikki yo'nalishni beradi, chizg'ich esa natijani tekshiradi.",
          "ru": "Верно. Линейка строит отрезок, угольник задаёт два направления, а линейка проверяет результат.",
          "en": "Correct. Use the ruler for the segment, the set square for both directions, then the ruler to check the construction."
        },
        {
          "uz": "Yana bir qarang: Transportir va sirkul olti santimetrli AB kesmani bermaydi. Kesmani chizg'ich bilan, yo'nalishlarni go'niya bilan yasang, so'ng tekshiring.",
          "ru": "Посмотрите ещё раз: Транспортир и циркуль не задают отрезок AB длиной шесть сантиметров. Постройте его линейкой, а направления задайте угольником.",
          "en": "Look again: A protractor and compasses do not set the six-centimetre AB segment. Use a ruler for AB and a set square for the directions."
        },
        {
          "uz": "Yana bir qarang: AB kesmasi chizilmasdan go'niyaning boshlang'ich yo'nalishi aniqlanmaydi. Avval olti santimetrli kesmani chizg'ich bilan yasang.",
          "ru": "Посмотрите ещё раз: Пока отрезок AB не построен, угольнику не с чем совмещать направление. Сначала постройте линейкой отрезок длиной шесть сантиметров.",
          "en": "Look again: Before AB is drawn, the set square has no baseline to follow. Construct the six-centimetre segment with a ruler first."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Chizg'ich kesmani yasaydi, go'niya ikki yo'nalishni beradi, chizg'ich esa natijani tekshiradi.",
        "ru": "Верно. Линейка строит отрезок, угольник задаёт два направления, а линейка проверяет результат.",
        "en": "Correct. Use the ruler for the segment, the set square for both directions, then the ruler to check the construction."
      },
      {
        "uz": "Yana bir qarang: Transportir va sirkul olti santimetrli AB kesmani bermaydi. Kesmani chizg'ich bilan, yo'nalishlarni go'niya bilan yasang, so'ng tekshiring.",
        "ru": "Посмотрите ещё раз: Транспортир и циркуль не задают отрезок AB длиной шесть сантиметров. Постройте его линейкой, а направления задайте угольником.",
        "en": "Look again: A protractor and compasses do not set the six-centimetre AB segment. Use a ruler for AB and a set square for the directions."
      },
      {
        "uz": "Yana bir qarang: AB kesmasi chizilmasdan go'niyaning boshlang'ich yo'nalishi aniqlanmaydi. Avval olti santimetrli kesmani chizg'ich bilan yasang.",
        "ru": "Посмотрите ещё раз: Пока отрезок AB не построен, угольнику не с чем совмещать направление. Сначала постройте линейкой отрезок длиной шесть сантиметров.",
        "en": "Look again: Before AB is drawn, the set square has no baseline to follow. Construct the six-centimetre segment with a ruler first."
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
      "uz": "Yasash ustasining tekshiruvlari",
      "ru": "Проверки мастера построений",
      "en": "Construction master's checks"
    },
    "scene": "summary",
    "frames": [
      {
        "uz": "Asbobni vazifaga mos tanlang.",
        "ru": "Выберите инструмент по задаче.",
        "en": "Match the tool to the task."
      },
      {
        "uz": "Boshlang'ich nuqtani aniq belgilang.",
        "ru": "Точно отметьте начальную точку.",
        "en": "Mark the starting point accurately."
      },
      {
        "uz": "Yo'nalishni saqlang.",
        "ru": "Сохраняйте нужное направление.",
        "en": "Keep the required direction."
      },
      {
        "uz": "Uzunlik yoki burchakni o'lchang.",
        "ru": "Измерьте длину или угол.",
        "en": "Measure the length or angle."
      },
      {
        "uz": "Natijani qayta tekshiring.",
        "ru": "Ещё раз проверьте результат.",
        "en": "Recheck the result."
      }
    ],
    "audio": {
      "uz": [
        "Asbobni vazifaga mos tanlang.",
        "Boshlang'ich nuqtani aniq belgilang.",
        "Yo'nalishni saqlang.",
        "Uzunlik yoki burchakni o'lchang.",
        "Natijani qayta tekshiring."
      ],
      "ru": [
        "Выберите инструмент по задаче.",
        "Точно отметьте начальную точку.",
        "Сохраняйте нужное направление.",
        "Измерьте длину или угол.",
        "Ещё раз проверьте результат."
      ],
      "en": [
        "Match the tool to the task.",
        "Mark the starting point accurately.",
        "Keep the required direction.",
        "Measure the length or angle.",
        "Recheck the result."
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
const AudioIndicator = ({ audio }) => { const t = useT(); const muteLabel = t(audio.muted ? bi("Ovozni yoqish", 'Включить звук', 'Turn sound on') : bi("Ovozni o'chirish", 'Выключить звук', 'Turn sound off')); const replayLabel = t(bi('Qayta eshitish', 'Повторить', 'Replay')); return <div className="audio-indicator"><button type="button" onClick={audio.toggleMute} aria-label={muteLabel} title={muteLabel}>{audio.muted ? '🔇' : '🔊'}</button><span className={audio.isPlaying ? 'audio-wave playing' : 'audio-wave'}><i/><i/><i/></span>{!audio.muted && <button type="button" onClick={audio.replay} aria-label={replayLabel} title={replayLabel}>↻</button>}</div>; };
const ScreenTypeLabel = ({ type }) => { const t = useT(); const labels = { hook: bi('Taxmin', 'Гипотеза', "Estimate"), exploration: bi('Tadqiqot', 'Исследование', "Explore"), rule: bi('Qoida', 'Правило', "Rule"), strategy: bi('Strategiya', 'Стратегия', 'Strategy'), error: bi('Xatoni tuzatish', 'Исправление ошибки', 'Error repair'), test: bi('Mashq', 'Задание', "Task"), case: bi('Vaziyat', 'Ситуация', "Situation"), summary: bi('Yakun', 'Итог', "Summary") }; return <span className="screen-type">{t(labels[type])}</span>; };
const Stage = ({ screen, audio, onPrev, onNext, canAdvance = true, canFinish = true, finish = false, children }) => { const t = useT(); const mobile = useIsMobile(); const meta = SCREEN_META[screen]; const c = CONTENT[`s${screen}`]; const pad = mobile ? 12 : 24; const ready = canAdvance && canFinish && isAudioReady(audio); const showCaption = Boolean(audio?.caption && (audio.muted || audio.visualOnly)); return <main className={`stage stage-${meta.type}`}><header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}><div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}><div className="progress-fill progress-bar" style={{ width: `${(screen + 1) / TOTAL_SCREENS * 100}%` }}/></div><div className="stage-chrome"><div className="chrome-title"><span className="status-dot"/><span>{t(c.eyebrow)}</span></div><div className="chrome-actions"><ScreenTypeLabel type={meta.type}/>{audio && <AudioIndicator audio={audio}/>}<span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span></div></div></header><section className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}><div className="stage-body">{children}</div><div className="caption-slot" aria-live="polite">{showCaption ? <div className="caption">{audio.caption}</div> : <span aria-hidden="true"/>}</div></section><footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>{screen === 0 ? <span/> : <button type="button" className="btn-ghost" onClick={onPrev}>← {t(bi('Orqaga', 'Назад', "Back"))}</button>}<button type="button" className="btn-white-accent" disabled={!ready} aria-disabled={!ready} onClick={onNext}>{finish ? t(bi('Darsni yakunlash', 'Завершить урок', "Finish lesson")) : t(bi('Davom etish', 'Продолжить', "Continue"))} →</button></footer></main>; };
const Heading = ({ c, state = 'present', showBit = false }) => { const t = useT(); return <div className={'heading ' + (showBit ? '' : 'heading-solo')}><div><span>{t(c.eyebrow)}</span><h1>{t(c.title)}</h1></div>{showBit && <BitSVG state={state}/>}</div>; };

const G4TitleReveal = ({ active, title, onComplete }) => {
  const t = useT();
  useEffect(() => { if (!active) return undefined; const timer = window.setTimeout(() => onComplete?.(), window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 80 : 3200); return () => window.clearTimeout(timer); }, [active, onComplete]);
  if (!active || typeof document === 'undefined') return null;
  return createPortal(<div className="g4-title-reveal-overlay" role="status" aria-live="assertive" aria-atomic="true" aria-label={`${t(bi('Unvon olindi', 'Звание получено', 'Title earned'))}: ${t(title)}`}><div className="g4-title-reveal-card"><div className="g4-title-reveal-rays" aria-hidden="true"/><div className="g4-title-reveal-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ '--g4-title-i': index, '--g4-title-delay': `${(index % 7) * -0.21}s` }}/>)}</div><div className="g4-title-reveal-medal" aria-hidden="true">★</div><h2>{t(title)}</h2></div></div>, document.body);
};
const G4TitleCard = ({ title, answers = [] }) => {
  const t = useT(); const scored = SCREEN_META.map((item, index) => item.scored ? index : null).filter((index) => index !== null); const firstTry = scored.filter((index) => answers[index]?.firstTry === true).length;
  return <aside className="g4-title-card-stage" role="status" aria-live="polite" aria-atomic="true"><div className="g4-title-card-confetti" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index}/>)}</div><div className="g4-title-card-bit"><BitSVG state="happy"/></div><div className="g4-title-card-medal" aria-hidden="true">★</div><span className="g4-title-card-kicker">{t(bi('UNVON OLINDI', 'ЗВАНИЕ ПОЛУЧЕНО', 'TITLE EARNED'))}</span><h2>{t(title)}</h2><div className="g4-title-card-score"><strong>{firstTry}/{scored.length}</strong><span>{t(bi('birinchi urinishda', 'с первой попытки', 'on the first attempt'))}</span></div></aside>;
};
function ConversionVisual({ scene, frame }) {
  const f = Math.max(0, Math.min(4, frame));
  const on = (step) => step <= f ? 'topic-step topic-on' : 'topic-step';
  if (scene === 'hook') return <div className="topic-visual topic-v38 scene-hook" aria-hidden="true"><svg viewBox="0 0 600 220">
    <g className={on(0)}><line x1="48" y1="78" x2="194" y2="78" stroke="#173B52" strokeWidth="6" strokeLinecap="round"/><circle cx="48" cy="78" r="7" fill="#FF5B35"/><circle cx="194" cy="78" r="7" fill="#95C93D"/><text x="121" y="55" textAnchor="middle" fill="#173B52" fontSize="20" fontWeight="900">7 cm</text><text x="121" y="112" textAnchor="middle" fill="#FF5B35" fontSize="26" fontWeight="900">?</text></g>
    <g className={on(1)}><line x1="246" y1="42" x2="246" y2="150" stroke="#168FA3" strokeWidth="6"/><line x1="246" y1="150" x2="354" y2="150" stroke="#173B52" strokeWidth="6"/><path d="M246 124 h26 v26" fill="none" stroke="#FF5B35" strokeWidth="4"/><text x="300" y="190" textAnchor="middle" fill="#FF5B35" fontSize="26" fontWeight="900">?</text></g>
    <g className={on(2)}><line x1="426" y1="158" x2="558" y2="158" stroke="#173B52" strokeWidth="6"/><line x1="426" y1="158" x2="482" y2="40" stroke="#168FA3" strokeWidth="6"/><path d="M472 158 A46 46 0 0 1 446 116" fill="none" stroke="#FF5B35" strokeWidth="4"/><text x="514" y="102" textAnchor="middle" fill="#173B52" fontSize="21" fontWeight="900">65°</text><text x="514" y="192" textAnchor="middle" fill="#FF5B35" fontSize="26" fontWeight="900">?</text></g>
  </svg></div>;
  if (scene === 'construction-plan') return <div className="topic-visual topic-v38 scene-construction-plan" aria-hidden="true"><svg viewBox="0 0 600 220">
    <g className={on(0)}><rect x="34" y="112" width="142" height="30" rx="7" fill="#FFF" stroke="#173B52" strokeWidth="4"/>{Array.from({length:6},(_,i)=><line key={i} x1={48+i*22} y1="112" x2={48+i*22} y2={i%2?126:136} stroke="#168FA3" strokeWidth="3"/>)}<line x1="48" y1="88" x2="160" y2="88" stroke="#FF5B35" strokeWidth="6" strokeLinecap="round"/><text x="105" y="174" textAnchor="middle" fill="#173B52" fontSize="17" fontWeight="900">AB = 6 cm</text></g>
    <g className={on(1)}><path d="M238 158 L238 54 L352 158 Z" fill="#E5F5F6" stroke="#168FA3" strokeWidth="5"/><path d="M238 132 h26 v26" fill="none" stroke="#FF5B35" strokeWidth="4"/><line x1="238" y1="158" x2="238" y2="28" stroke="#FF5B35" strokeWidth="5"/><line x1="352" y1="158" x2="500" y2="158" stroke="#173B52" strokeWidth="5"/><path d="M378 150 l18 8 -18 8 M428 150 l18 8 -18 8" fill="none" stroke="#95C93D" strokeWidth="4"/></g>
    <g className={on(2)}><rect x="424" y="42" width="128" height="26" rx="7" fill="#FFF" stroke="#173B52" strokeWidth="4"/>{Array.from({length:5},(_,i)=><line key={i} x1={438+i*23} y1="42" x2={438+i*23} y2={i%2?53:63} stroke="#168FA3" strokeWidth="3"/>)}<circle cx="548" cy="104" r="16" fill="#95C93D"/><path d="M540 104 l6 6 11-15" fill="none" stroke="#173B52" strokeWidth="4"/></g>
  </svg></div>;
  const allTools = scene === 'summary';
  const rulerMode = allTools || /ruler|segment|length-tool/.test(scene);
  const squareMode = allTools || /set-square|perpendicular|parallel/.test(scene);
  const angleMode = allTools || /protractor|angle/.test(scene);
  if (allTools) return <div className={'topic-visual topic-v38 scene-' + scene} aria-hidden="true"><svg viewBox="0 0 600 220">
    <g className={on(0)} transform="translate(22 18)"><rect x="18" y="116" width="180" height="28" rx="7" fill="#FFF" stroke="#173B52" strokeWidth="4"/>{Array.from({length:8},(_,i)=><line key={i} x1={34+i*21} y1="116" x2={34+i*21} y2={i%2?130:137} stroke="#168FA3" strokeWidth="3"/>)}<line x1="35" y1="94" x2="181" y2="94" stroke="#FF5B35" strokeWidth="6" strokeLinecap="round"/></g>
    <g className={on(1)} transform="translate(204 20)"><path d="M42 158 L42 54 L158 158 Z" fill="#E5F5F6" stroke="#168FA3" strokeWidth="5"/><path d="M42 131 H69 V158" fill="none" stroke="#FF5B35" strokeWidth="4"/></g>
    <g className={on(2)} transform="translate(390 18)"><path d="M20 156 A78 78 0 0 1 176 156" fill="#FFF0EA" stroke="#FF5B35" strokeWidth="5"/><line x1="98" y1="156" x2="132" y2="84" stroke="#173B52" strokeWidth="5"/><circle cx="98" cy="156" r="7" fill="#95C93D"/><text x="142" y="83" fill="#173B52" fontSize="20" fontWeight="900">65°</text></g>
    <g className={on(3)}><circle cx="300" cy="202" r="14" fill="#95C93D"/><path d="M293 202 l5 5 10-13" fill="none" stroke="#173B52" strokeWidth="4"/></g>
  </svg></div>;
  if (rulerMode) return <div className={'topic-visual topic-v38 scene-' + scene} aria-hidden="true"><svg viewBox="0 0 600 220">
    <g className={on(0)}><rect x="72" y="126" width="456" height="42" rx="9" fill="#FFF" stroke="#173B52" strokeWidth="5"/>{Array.from({length:15},(_,i)=><line key={i} x1={92+i*29} y1="126" x2={92+i*29} y2={i%2?145:156} stroke="#168FA3" strokeWidth="3"/>)}</g>
    <g className={on(1)}><circle cx="92" cy="102" r="8" fill="#FF5B35"/><text x="92" y="84" textAnchor="middle" fill="#173B52" fontSize="18" fontWeight="900">A · 0</text></g>
    <g className={on(2)}><line x1="92" y1="102" x2="440" y2="102" stroke="#FF5B35" strokeWidth="7" strokeLinecap="round"/><circle cx="440" cy="102" r="8" fill="#95C93D"/><text x="440" y="84" textAnchor="middle" fill="#173B52" fontSize="18" fontWeight="900">B · 7 cm</text></g>
    <g className={on(3)}><rect x="227" y="28" width="146" height="42" rx="14" fill="#E7F3EC" stroke="#227A53" strokeWidth="3"/><text x="300" y="56" textAnchor="middle" fill="#173B52" fontSize="22" fontWeight="900">AB = 7 cm</text></g>
  </svg></div>;
  if (squareMode) {
    const parallel = /parallel/.test(scene);
    return <div className={'topic-visual topic-v38 scene-' + scene} aria-hidden="true"><svg viewBox="0 0 600 220">
      <g className={on(0)}><line x1="68" y1="166" x2="532" y2="166" stroke="#173B52" strokeWidth="6"/><circle cx="252" cy="166" r="8" fill="#FF5B35"/><text x="252" y="194" textAnchor="middle" fill="#173B52" fontSize="18" fontWeight="900">P</text></g>
      <g className={on(1)} transform={parallel ? 'translate(80 -20)' : 'translate(210 0)'}><path d="M42 166 L42 54 L166 166 Z" fill="#E5F5F6" stroke="#168FA3" strokeWidth="5"/><path d="M42 137 H71 V166" fill="none" stroke="#FF5B35" strokeWidth="4"/></g>
      <g className={on(2)}>{parallel ? <><line x1="68" y1="70" x2="532" y2="70" stroke="#FF5B35" strokeWidth="6"/><path d="M275 62 l18 8 -18 8 M330 62 l18 8 -18 8" fill="none" stroke="#95C93D" strokeWidth="4"/></> : <><line x1="252" y1="166" x2="252" y2="34" stroke="#FF5B35" strokeWidth="6"/><path d="M252 137 h29 v29" fill="none" stroke="#95C93D" strokeWidth="4"/></>}</g>
      <g className={on(3)}><circle cx="506" cy="38" r="16" fill="#95C93D"/><path d="M498 38 l6 6 11-15" fill="none" stroke="#173B52" strokeWidth="4"/></g>
    </svg></div>;
  }
  if (angleMode) return <div className={'topic-visual topic-v38 scene-' + scene} aria-hidden="true"><svg viewBox="0 0 600 220">
    <g className={on(0)}><line x1="110" y1="176" x2="500" y2="176" stroke="#173B52" strokeWidth="6"/><circle cx="300" cy="176" r="8" fill="#95C93D"/></g>
    <g className={on(1)}><path d="M142 176 A158 158 0 0 1 458 176" fill="#FFF0EA" stroke="#168FA3" strokeWidth="5"/><line x1="300" y1="176" x2="300" y2="30" stroke="#168FA3" strokeWidth="3" strokeDasharray="8 7"/></g>
    <g className={on(2)}><circle cx="364" cy="38" r="8" fill="#FF5B35"/><text x="392" y="44" fill="#173B52" fontSize="24" fontWeight="900">65°</text></g>
    <g className={on(3)}><line x1="300" y1="176" x2="364" y2="38" stroke="#FF5B35" strokeWidth="6"/></g>
    <g className={on(4)}><circle cx="510" cy="44" r="16" fill="#95C93D"/><path d="M502 44 l6 6 11-15" fill="none" stroke="#173B52" strokeWidth="4"/></g>
  </svg></div>;
  return <div className={'topic-visual topic-v38 scene-' + scene} aria-hidden="true"><svg viewBox="0 0 600 220"><g className={on(0)}><line x1="90" y1="110" x2="510" y2="110" stroke="#173B52" strokeWidth="6"/></g><g className={on(1)}><circle cx="300" cy="110" r="18" fill="#95C93D"/></g></svg></div>;
}
const RevealFrames = ({ frames, frame }) => { const t = useT(); return <div className="reveal-grid">{frames.map((item, index) => <div className={index <= frame ? 'reveal-card show' : 'reveal-card'} key={index}><b>{index + 1}</b><span>{t(item)}</span></div>)}</div>; };
const GuidedFramePanel = ({ frames, step, onAdvance, audioReady }) => { const t = useT(); const complete = step >= frames.length - 1; return <div className="guided-panel" aria-live="polite"><div className="guided-progress" aria-label={`${step + 1} / ${frames.length}`}>{frames.map((_, index) => <i className={index <= step ? 'active' : ''} key={index}/>)}</div><div className="guided-frame"><b>{step + 1}</b><span>{t(frames[step])}</span></div><div className="guided-action">{complete ? <span className="guided-complete">✓ {t(bi('Bosqichlar tugadi', 'Шаги завершены', 'Steps complete'))}</span> : <button type="button" className="btn-white-accent step-button" disabled={!audioReady} onClick={onAdvance}>{t(bi('Keyingi qadam', 'Следующий шаг', 'Next step'))} →</button>}</div></div>; };
function HookScreen({ screen, storedAnswer, onAnswer, onPrev, onNext }) { const t = useT(); const c = CONTENT.s0; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null); const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0); const answerReady = isAudioReady(audio); const choose = (index) => { if (!answerReady) return; const nextAttempts = attempts + 1; setPicked(index); setAttempts(nextAttempts); audio.pushOneOff(t(HOOK_FEEDBACK)); onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: t(c.question), options: c.options.map((option) => t(option)), correctIndex: null, correctAnswer: null, studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: true, firstTry: storedAnswer?.firstTry ?? true, attempts: nextAttempts, wrongChoices: [] }); }; return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={picked !== null}><div className="stack hook-stack" data-g4-screen="hook"><Heading c={c} state="think" showBit/><section className="model-card hook-card" data-g4-role="hook-scene"><ConversionVisual scene={c.scene} frame={audio.frame}/><RevealFrames frames={c.frames} frame={audio.frame}/></section><section className="question hook-question" data-g4-role="answer-card" aria-live="polite"><h2>{t(c.question)}</h2><div className="options">{c.options.map((option, index) => <button type="button" className={'option ' + (picked === index ? 'picked' : '')} disabled={!answerReady} onClick={() => choose(index)} key={index}><b>{String.fromCharCode(65 + index)}</b><span>{t(option)}</span></button>)}</div><div className="feedback-slot hook-feedback-slot">{picked !== null && <div className="feedback open neutral" data-g4-feedback="diagnostic"><b>◆</b><p>{t(HOOK_FEEDBACK)}</p></div>}</div></section></div></Stage>; }
function InfoScreen({ screen, onPrev, onNext }) { const c = CONTENT[`s${screen}`]; const [step, setStep] = useState(0); const audio = useGuidedNarration(c.audio, screen, step); const complete = step >= c.frames.length - 1; const audioReady = isAudioReady(audio); const advance = () => { if (complete || !audioReady) return; const nextStep = step + 1; setStep(nextStep); audio.speakStep(nextStep); }; const bitState = screen === 7 ? 'happy' : ['focus', 'point', 'idea'][(screen - 1) % 3]; return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={complete}><div className="stack info-stack"><Heading c={c} state={bitState} showBit/><section className="model-card guided-card"><ConversionVisual scene={c.scene} frame={step}/><GuidedFramePanel frames={c.frames} step={step} onAdvance={advance} audioReady={audioReady}/></section></div></Stage>; }
function QuestionScreen({ screen, storedAnswer, onAnswer, onPrev, onNext }) { const t = useT(); const c = CONTENT[`s${screen}`]; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null); const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0); const [wrongChoices, setWrongChoices] = useState(storedAnswer?.wrongChoices ?? []); const openChoice = SCREEN_META[screen].type === 'strategy'; const revealed = picked !== null; const correct = openChoice ? revealed : picked === c.correctIndex; const canAnswer = isAudioReady(audio); const baseBitState = screen === 12 ? 'awkward' : screen === 13 ? 'point' : 'focus'; const bitState = revealed ? (correct ? 'nod' : 'awkward') : baseBitState; const choose = (index) => { if (!canAnswer || correct || wrongChoices.includes(index)) return; const ok = openChoice || index === c.correctIndex; const nextAttempts = attempts + 1; const nextWrongChoices = ok ? wrongChoices : [...wrongChoices, index]; setPicked(index); setAttempts(nextAttempts); setWrongChoices(nextWrongChoices); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(t(ok ? c.audio.on_correct : c.feedbackAudio[index])); onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: t(c.question), options: c.options.map((option) => t(option)), correctIndex: c.correctIndex, correctAnswer: t(c.options[c.correctIndex]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: ok, firstTry: storedAnswer?.firstTry === false ? false : nextAttempts === 1 && ok, attempts: nextAttempts, wrongChoices: nextWrongChoices }); }; const showProof = !openChoice && (correct || (!correct && wrongChoices.length >= 2)); return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={correct}><div className="stack question-stack"><Heading c={c} state={bitState} showBit/><section className="test-layout"><div className="test-model"><ConversionVisual scene={c.scene} frame={audio.frame}/><RevealFrames frames={c.frames} frame={audio.frame}/></div><div className="question" aria-live="polite"><h2>{t(c.question)}</h2><div className="options">{c.options.map((option, index) => { const cls = openChoice && picked === index ? 'picked' : index === c.correctIndex && correct ? 'right' : wrongChoices.includes(index) ? 'bad' : ''; return <button type="button" className={'option ' + cls} disabled={!canAnswer || correct || wrongChoices.includes(index)} onClick={() => choose(index)} key={index}><b>{String.fromCharCode(65 + index)}</b><span>{t(option)}</span></button>; })}</div><div className="feedback-slot question-feedback-slot">{revealed && <div className="feedback-stack"><div className={'feedback open ' + (correct ? 'correct' : 'wrong')} data-g4-feedback={correct ? 'correct' : 'retry'}><BitSVG className="feedback-bit" state={correct ? "nod" : "awkward"}/><p>{t(correct ? c.audio.on_correct : c.audio.on_wrong[picked])}</p></div>{showProof && <div className="proof"><b className="proof-label">{t(SOLUTION_LABEL)}</b><span>{t(c.proof)}</span></div>}</div>}</div></div></section></div></Stage>; }
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
return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={finish} canAdvance={complete && reflection !== null} canFinish={titleState === 'claimed'} finish><div className="stack summary-stack"><Heading c={c} state={titleState === 'claimed' ? 'happy' : 'idea'} showBit/>{!complete ? <section className="model-card summary-card guided-card"><ConversionVisual scene={c.scene} frame={step}/><GuidedFramePanel frames={c.frames} step={step} onAdvance={advance} audioReady={audioReady}/></section> : <div className="summary-complete"><section className="reflection-card final-reflection" data-g4-role="reflection" aria-live="polite"><h2>{t(REFLECTION.question)}</h2><div className="reflection-options">{REFLECTION.options.map((option, index) => <button type="button" className={'option ' + (reflection === index ? 'picked' : '')} disabled={!audioReady || revealRequested} onClick={() => chooseReflection(index)} key={index}><b>{String.fromCharCode(65 + index)}</b><span>{t(option)}</span></button>)}</div></section><G4TitleReveal active={revealRequested} title={LESSON_REWARD_TITLE} onComplete={completeReveal}/>{titleState !== 'claimed' ? <section className="title-claim-card"><span>★</span><h2>{t(LESSON_REWARD_TITLE)}</h2><button type="button" className="btn-white-accent g4-title-claim" disabled={reflection === null || revealRequested || !audioReady} onClick={claimTitle}>{t(bi('Unvonni olish', 'Получить звание', 'Claim title'))}</button></section> : null}{titleState === 'claimed' && <div data-g4-role="title-card"><G4TitleCard title={LESSON_REWARD_TITLE} answers={answers}/></div>}</div>}</div></Stage>;
}
const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];
export default function Grade4Dars38({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) { const preview = previewMode ?? (langProp === undefined || langProp === null); const initialLang = normalizeLang(langProp); const [previewLang, setPreviewLang] = useState(initialLang); const lang = preview ? normalizeLang(previewLang) : initialLang; configureLesson({ ttsApiBase: ttsApiBase || '', voiceGender: voiceGender || 'f', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', previewMode: preview }); const [current, setCurrent] = useState(0); const [answers, setAnswers] = useState([]); const [finalState, setFinalState] = useState({ step: 0, reflection: null, titleClaimed: false }); const [startedAt] = useState(() => Date.now()); const finished = useRef(false); const recordAnswer = useCallback((answer) => setAnswers((previous) => { const next = [...previous]; const old = previous[answer.screenIdx]; next[answer.screenIdx] = { ...answer, firstTry: old ? old.firstTry : answer.firstTry }; return next; }), []); const finishLesson = useCallback(() => { if (finished.current) return; finished.current = true; const scored = SCREEN_META.map((meta, index) => meta.scored ? index : null).filter((index) => index !== null); const firstTryCorrect = scored.filter((index) => answers[index]?.firstTry === true).length; const payload = { lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle[lang], studentName: studentName || null, durationSec: Math.floor((Date.now() - startedAt) / 1000), totalQuestions: scored.length, correctAnswers: firstTryCorrect, scorePercent: Math.round(firstTryCorrect / scored.length * 100), finalScore: firstTryCorrect, finalTotal: scored.length, passed: firstTryCorrect / scored.length >= 0.6, firstTryStats: { total: scored.length, firstTryCorrect }, attemptsTotal: scored.reduce((sum, index) => sum + (answers[index]?.attempts ?? 0), 0), skillTags: LESSON_META.skillTags, answers: answers.filter(Boolean) }; if (onFinished) onFinished(payload); else console.log('[Grade4 Dars38 preview]', payload); }, [answers, lang, onFinished, startedAt, studentName]); const Current = SCREENS[current]; return <LangContext.Provider value={lang}><style>{STYLES}</style><div className={'lesson-root ' + (preview ? 'lesson-root-preview' : '')}>{preview && <div className="preview-language" aria-label={bi("Ko'rish tili", 'Язык предпросмотра', 'Preview language')[lang]}>{['uz', 'ru', 'en'].map((code) => <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} finalState={finalState} onFinalState={setFinalState} onPrev={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))} finishLesson={finishLesson}/></div></LangContext.Provider>; }

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
@media(max-width:639.98px){.lesson-root-preview .stage-header{padding-top:52px}.screen-type{display:none}.stage{width:min(390px,100%)}.stage-header{padding-top:6px}.stage-chrome{min-height:46px}.chrome-title{max-width:92px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:9px}.chrome-actions{gap:4px}.screen-count{padding:4px 6px;font-size:9px}.audio-indicator{height:46px;padding:1px 3px}.audio-indicator button{width:44px;height:44px}.stage-content{grid-template-rows:minmax(0,1fr) 38px;padding-top:5px;padding-bottom:2px}.caption-slot{height:38px;min-height:38px;padding-top:3px}.caption{height:35px;padding:6px 9px;font-size:10px}.stage-nav{min-height:58px}.btn-white-accent,.btn-ghost{min-width:108px;min-height:48px;padding:0 10px;font-size:12px}.stack{gap:7px}.heading{height:56px;gap:8px}.heading h1{font-size:clamp(20px,6vw,24px)}.heading .g1-char{width:48px;height:60px}.model-card,.question,.test-model,.reflection-card{padding:8px;border-radius:15px}.model-card{grid-template-columns:minmax(126px,.86fr) minmax(156px,1.14fr);gap:7px}.hook-stack{grid-template-rows:auto minmax(0,.78fr) minmax(0,1.22fr)}.hook-question{grid-template-rows:auto auto minmax(52px,1fr)}.hook-question .options{grid-template-columns:repeat(3,minmax(0,1fr))}.hook-question .option{grid-template-columns:1fr;justify-items:center;align-content:center;text-align:center}.hook-question .option>b{display:none}.question h2{font-size:14px;line-height:1.16}.options{grid-template-columns:1fr;gap:5px}.option{min-height:44px;padding:5px 6px;border-radius:11px;grid-template-columns:24px 1fr;gap:5px;font-size:11px;line-height:1.15}.option>b{width:24px;height:24px}.feedback{padding:6px 7px;grid-template-columns:20px 1fr;gap:5px;font-size:10px}.proof{padding:5px 7px;font-size:9px}.test-layout{grid-template-columns:minmax(118px,.78fr) minmax(170px,1.22fr);gap:7px}.test-model{padding:6px}.test-model .reveal-grid{display:none}.question-feedback-slot{min-height:84px}.hook-feedback-slot{min-height:52px}.conversion-visual{height:100%;min-height:0;padding:6px;border-radius:13px;gap:6px}.guided-panel{grid-template-rows:8px minmax(58px,1fr) 46px;gap:7px}.guided-frame{min-height:58px;padding:8px;border-radius:13px;grid-template-columns:29px 1fr;gap:7px;font-size:11px}.guided-frame>b{width:29px;height:29px}.guided-action{min-height:46px}.step-button{min-width:124px}.guided-complete{padding:8px;font-size:10px}.summary-complete{grid-template-columns:1fr;grid-template-rows:88px minmax(0,1fr);gap:7px}.summary-complete .g4-title-card-stage{min-height:88px}.reflection-card h2{font-size:14px}.reflection-options{gap:5px}.preview-language{top:7px;left:50%;right:auto;transform:translateX(-50%)}}
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
@media(prefers-reduced-motion:reduce){.lesson-root *{animation:none!important;transition:none!important}}
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
.stage-hook .hook-card{background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%)}
html:has(.lesson-root),body:has(.lesson-root),#root:has(.lesson-root),.lesson-page:has(.lesson-root),.lesson-frame:has(.lesson-root){width:100%;height:100%;min-height:0!important;margin:0;overflow:hidden!important;overscroll-behavior:none}.lesson-root,.lesson-root *{box-sizing:border-box}.lesson-root h1,.lesson-root h2,.lesson-root p{margin:0}.lesson-root button{font:inherit}.lesson-root{position:fixed;inset:0;width:100%;height:100dvh;min-height:0;overflow:hidden;color:${T.ink};background:radial-gradient(circle at 88% 9%,rgba(22,143,163,.11),transparent 25%),linear-gradient(145deg,#F7F8F4,#EEF3F1);font-family:'Manrope',system-ui,sans-serif}.stage{width:min(936px,100%);height:100dvh;margin:0 auto;display:grid;grid-template-rows:auto minmax(0,1fr) auto;overflow:hidden;background:rgba(245,245,240,.92);box-shadow:0 0 50px -34px rgba(${T.shadowBase},.45)}.stage-header{min-height:0;padding-top:9px;background:rgba(245,245,240,.96);backdrop-filter:blur(10px);z-index:5}.progress-track{height:7px;border-radius:999px;overflow:hidden;background:#DDE5E3}.progress-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,${T.cyan},${T.lime});transition:width .45s ease}.progress-bar{box-shadow:0 0 15px rgba(22,143,163,.34)}.stage-chrome{min-height:48px;display:flex;align-items:center;justify-content:space-between;gap:12px}.chrome-title,.chrome-actions{display:flex;align-items:center;gap:9px}.chrome-title{color:${T.navy};font-size:12px;font-weight:900}.status-dot{width:9px;height:9px;border-radius:50%;background:${T.accent};box-shadow:0 0 0 5px rgba(255,91,53,.1)}.screen-type,.screen-count{padding:5px 9px;border-radius:999px;color:${T.cyan};background:${T.cyanSoft};font-size:10px;font-weight:900}.screen-count{color:${T.ink2};background:#FFF}.audio-indicator{height:46px;padding:3px 6px;border-radius:13px;display:flex;align-items:center;gap:4px;background:#FFF;box-shadow:0 9px 20px -17px rgba(${T.shadowBase},.6)}.audio-indicator button{width:44px;height:44px;border:0;border-radius:9px;background:transparent;cursor:pointer}.audio-wave{height:20px;display:flex;align-items:center;gap:2px}.audio-wave i{width:3px;height:6px;border-radius:4px;background:${T.cyan};transition:.25s}.audio-wave.playing i:nth-child(1){height:12px}.audio-wave.playing i:nth-child(2){height:18px}.audio-wave.playing i:nth-child(3){height:9px}
.stage-content{min-height:0;padding-top:7px;padding-bottom:4px;display:grid;grid-template-rows:minmax(0,1fr) 40px;overflow:hidden}.stage-body{min-height:0;overflow:hidden}.caption-slot{height:40px;min-height:40px;padding-top:4px;overflow:hidden}.stage-nav{min-height:62px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(245,245,240,.95)}.btn-white-accent,.btn-ghost{min-width:128px;min-height:50px;padding:0 18px;border:0;border-radius:15px;cursor:pointer;font-weight:900}.btn-white-accent{color:${T.accent};background:#fff;box-shadow:0 12px 24px -17px rgba(255,91,53,.8)}.btn-white-accent:hover:not(:disabled){color:#fff;background:${T.accent}}.btn-ghost{color:${T.ink2};background:transparent}.btn-ghost:hover{background:#fff}.stack{height:100%;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr);gap:10px;overflow:hidden;animation:page-in .45s cubic-bezier(.16,1,.3,1) both}.heading{height:68px;min-height:0;display:flex;align-items:center;justify-content:space-between;gap:16px}.heading.heading-solo{justify-content:flex-start}.heading>div>span{color:${T.cyan};font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.heading h1{margin-top:4px!important;font:750 clamp(25px,4vw,38px)/1.06 'Source Serif 4',Georgia,serif}.heading .g1-char{width:62px;height:76px;flex:0 0 auto;filter:drop-shadow(0 9px 11px rgba(23,59,82,.2))}.model-card,.question,.test-model{min-height:0;padding:14px;overflow:hidden;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.model-card{height:100%;display:grid;grid-template-columns:minmax(250px,.85fr) minmax(300px,1.15fr);align-items:stretch;gap:14px}.hook-card{background:linear-gradient(135deg,${T.cyanSoft},#FFF)}.summary-card{background:linear-gradient(135deg,#FFF,${T.successSoft})}.reveal-grid{min-height:0;display:grid;align-content:center;gap:7px;overflow:hidden}.reveal-card{min-height:48px;padding:9px 12px;border-radius:14px;display:grid;grid-template-columns:30px 1fr;align-items:center;gap:9px;opacity:.12;transform:translateY(7px);background:#F8F8F4;transition:.38s ease}.reveal-card.show{opacity:1;transform:none}.reveal-card>b{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;color:#FFF;background:${T.cyan};font:900 10px 'JetBrains Mono',monospace}.reveal-card:last-child.show{background:${T.cyanSoft}}.question{height:100%;display:grid;grid-template-rows:auto auto minmax(92px,1fr);align-content:start;gap:9px}.question h2{font:720 clamp(17px,2.5vw,22px)/1.25 'Source Serif 4',Georgia,serif}.options{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.option{min-height:50px;padding:8px;border:0;border-radius:16px;display:grid;grid-template-columns:28px 1fr;align-items:center;gap:8px;color:${T.ink};background:#F8F8F4;text-align:left;cursor:pointer;transition:.25s}.option:hover:not(:disabled){transform:translateY(-2px)}.option>b{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;color:${T.cyan};background:${T.cyanSoft};font:900 11px 'JetBrains Mono',monospace}.option.picked{background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.27)}.option.right{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.25)}.option.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.25)}.feedback{padding:8px 10px;border-radius:13px;display:grid;grid-template-columns:25px 1fr;align-items:start;gap:7px;font-size:12px;line-height:1.22}.feedback.correct{background:${T.successSoft};box-shadow:inset 4px 0 ${T.success}}.feedback.wrong{background:${T.warnSoft};box-shadow:inset 4px 0 ${T.warn}}.feedback.neutral{background:${T.cyanSoft};box-shadow:inset 4px 0 ${T.cyan}}.proof{padding:7px 10px;border-radius:11px;overflow:hidden;color:#FFF;background:${T.navy};text-align:center;font:900 15px 'JetBrains Mono',monospace}.test-layout{height:100%;min-height:0;display:grid;grid-template-columns:.86fr 1.14fr;gap:10px;overflow:hidden}.test-model{display:grid;grid-template-rows:minmax(0,1fr) auto;align-content:stretch;gap:8px}.caption{height:36px;margin:0;padding:7px 11px;border-radius:12px;overflow:hidden;color:#fff;background:rgba(23,59,82,.94);font-size:11px;line-height:1.2;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2}.feedback-slot{min-height:0;overflow:hidden}.feedback-stack{height:100%;display:grid;align-content:start;gap:6px;overflow:hidden}.question-feedback-slot{min-height:92px}.hook-feedback-slot{min-height:58px}.guided-panel{min-height:0;display:grid;grid-template-rows:10px minmax(72px,1fr) 50px;gap:10px;overflow:hidden}.guided-progress{display:flex;align-items:center;gap:6px}.guided-progress i{height:6px;flex:1;border-radius:999px;background:#DDE5E3}.guided-progress i.active{background:${T.cyan}}.guided-frame{min-height:72px;padding:12px;border-radius:16px;display:grid;grid-template-columns:34px 1fr;align-items:center;gap:10px;overflow:hidden;background:#F8F8F4;font-weight:850}.guided-frame>b{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;color:#FFF;background:${T.cyan};font:900 12px 'JetBrains Mono',monospace}.guided-action{display:flex;align-items:center;justify-content:flex-end;min-height:50px}.step-button{min-width:150px}.guided-complete{padding:10px 12px;border-radius:12px;color:${T.success};background:${T.successSoft};font-size:12px;font-weight:900}.summary-complete{height:100%;min-height:0;display:grid;grid-template-columns:.9fr 1.1fr;gap:10px;overflow:hidden}.summary-complete .g4-title-card-stage{height:100%;min-height:0}.reflection-card{min-height:0;padding:14px;border-radius:20px;display:grid;grid-template-rows:auto minmax(0,1fr);gap:9px;overflow:hidden;background:#FFF;box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.reflection-card h2{font:720 18px/1.22 'Source Serif 4',Georgia,serif}.reflection-options{min-height:0;display:grid;grid-template-rows:repeat(3,minmax(44px,1fr));gap:7px;overflow:hidden}
.conversion-visual{min-height:210px;padding:14px;border-radius:20px;display:grid;place-items:center;gap:12px;background:linear-gradient(145deg,${T.cyanSoft},#FFF)}.relation-cards{width:100%;display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.relation-cards span{padding:12px 8px;border-radius:13px;opacity:.18;background:#FFF;text-align:center;font:900 12px 'JetBrains Mono',monospace;transition:.35s}.relation-cards span.active{opacity:1;color:#FFF;background:${T.cyan}}.console-screen{padding:13px 24px;border-radius:14px;color:#FFF;background:${T.navy};font:900 25px 'JetBrains Mono',monospace}.cross{position:absolute;color:${T.accent};font-size:84px;font-weight:900;opacity:0;transform:scale(.6) rotate(-15deg);transition:.4s}.cross.show{opacity:.85;transform:scale(1) rotate(-15deg)}.console{position:relative}.tape-line{width:260px;height:28px;padding:4px;border-radius:10px;background:#FFF}.tape-line i{height:100%;display:block;border-radius:7px;background:${T.cyan};transition:.5s}.tape strong{font:900 18px 'JetBrains Mono',monospace}.area-grid>div{width:150px;height:150px;padding:3px;display:grid;grid-template-columns:repeat(10,1fr);gap:2px;border:3px solid ${T.navy};border-radius:12px;background:#FFF}.area-grid i{border-radius:2px;background:#DDE7E6;transition:.35s}.area-grid i.active{background:${T.cyan}}.area-grid strong{font:900 14px 'JetBrains Mono',monospace}.algorithm{align-content:center}.algorithm span{width:min(380px,100%);padding:10px 14px;border-radius:12px;opacity:.16;background:#FFF;text-align:center;font:900 13px 'JetBrains Mono',monospace;transition:.35s}.algorithm span.active{opacity:1}.algorithm span:last-child.active{color:#FFF;background:${T.success}}.manifest{grid-template-columns:repeat(2,1fr)}.manifest span{padding:20px 12px;border-radius:15px;opacity:.2;background:#FFF;text-align:center;font-weight:900;transition:.35s}.manifest span.active{opacity:1;color:#FFF;background:${T.navy}}.direction>div{display:flex;align-items:center;gap:14px}.direction b{padding:15px;border-radius:13px;background:#FFF}.direction span{color:${T.accent};font-size:30px}.direction small{font-weight:900}.preview-language{position:fixed;top:9px;right:9px;z-index:30;display:flex;gap:3px;padding:3px;border-radius:999px;background:rgba(255,255,255,.94)}.preview-language button{min-width:44px;min-height:44px;padding:4px 9px;border:0;border-radius:999px;background:transparent;cursor:pointer;font-size:10px;font-weight:900}.preview-language .preview-active{color:#FFF;background:${T.accent}}button:focus-visible,input:focus-visible{outline:3px solid rgba(22,143,163,.48);outline-offset:3px}@keyframes page-in{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
@media(max-width:639.98px){.lesson-root-preview .stage-header{padding-top:52px}.screen-type{display:none}.stage{width:min(390px,100%)}.stage-header{padding-top:6px}.stage-chrome{min-height:46px}.chrome-title{max-width:92px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:9px}.chrome-actions{gap:4px}.screen-count{padding:4px 6px;font-size:9px}.audio-indicator{height:46px;padding:1px 3px}.audio-indicator button{width:44px;height:44px}.stage-content{grid-template-rows:minmax(0,1fr) 38px;padding-top:5px;padding-bottom:2px}.caption-slot{height:38px;min-height:38px;padding-top:3px}.caption{height:35px;padding:6px 9px;font-size:10px}.stage-nav{min-height:58px}.btn-white-accent,.btn-ghost{min-width:108px;min-height:48px;padding:0 10px;font-size:12px}.stack{gap:7px}.heading{height:56px;gap:8px}.heading h1{font-size:clamp(20px,6vw,24px)}.heading .g1-char{width:48px;height:60px}.model-card,.question,.test-model,.reflection-card{padding:8px;border-radius:15px}.model-card{grid-template-columns:minmax(126px,.86fr) minmax(156px,1.14fr);gap:7px}.hook-stack{grid-template-rows:auto minmax(0,.78fr) minmax(0,1.22fr)}.hook-question{grid-template-rows:auto auto minmax(52px,1fr)}.hook-question .options{grid-template-columns:repeat(3,minmax(0,1fr))}.hook-question .option{grid-template-columns:1fr;justify-items:center;align-content:center;text-align:center}.hook-question .option>b{display:none}.question h2{font-size:14px;line-height:1.16}.options{grid-template-columns:1fr;gap:5px}.option{min-height:44px;padding:5px 6px;border-radius:11px;grid-template-columns:24px 1fr;gap:5px;font-size:11px;line-height:1.15}.option>b{width:24px;height:24px}.feedback{padding:6px 7px;grid-template-columns:20px 1fr;gap:5px;font-size:10px}.proof{padding:5px 7px;font-size:9px}.test-layout{grid-template-columns:minmax(118px,.78fr) minmax(170px,1.22fr);gap:7px}.test-model{padding:6px}.test-model .reveal-grid{display:none}.question-feedback-slot{min-height:84px}.hook-feedback-slot{min-height:52px}.conversion-visual{height:100%;min-height:0;padding:6px;border-radius:13px;gap:6px}.guided-panel{grid-template-rows:8px minmax(58px,1fr) 46px;gap:7px}.guided-frame{min-height:58px;padding:8px;border-radius:13px;grid-template-columns:29px 1fr;gap:7px;font-size:11px}.guided-frame>b{width:29px;height:29px}.guided-action{min-height:46px}.step-button{min-width:124px}.guided-complete{padding:8px;font-size:10px}.summary-complete{grid-template-columns:1fr;grid-template-rows:88px minmax(0,1fr);gap:7px}.summary-complete .g4-title-card-stage{min-height:88px}.reflection-card h2{font-size:14px}.reflection-options{gap:5px}.preview-language{top:7px;left:50%;right:auto;transform:translateX(-50%)}}
@media(max-height:700px){.stage-header{padding-top:4px}.stage-chrome{min-height:44px}.stage-content{grid-template-rows:minmax(0,1fr) 34px}.caption-slot{height:34px;min-height:34px}.caption{height:31px;padding:5px 8px}.stage-nav{min-height:56px}.heading{height:52px}.heading .g1-char{width:44px;height:55px}.stack{gap:6px}.model-card,.question,.test-model,.reflection-card{padding:7px}.question-feedback-slot{min-height:78px}.hook-feedback-slot{min-height:48px}.guided-panel{grid-template-rows:7px minmax(52px,1fr) 44px;gap:5px}.guided-action{min-height:44px}.step-button{min-height:44px}.summary-complete{grid-template-rows:82px minmax(0,1fr)}}
@media(prefers-reduced-motion:reduce){.lesson-root *{animation:none!important;transition:none!important}}
`;
