import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// 4-sinf · Dars 33 · Burchak turlari
// 15 ekran · boshqariladigan audio · har bir mazmunli harakat yakunlangach navigatsiya ochiladi.
const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};
const FRAME_COUNTS = [3, 4, 4, 4, 4, 4, 4, 5, 2, 2, 2, 2, 2, 3, 5];
const TOTAL_SCREENS = FRAME_COUNTS.length;
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
const LESSON_KIND = "angle";
const LESSON_META = { lessonId: "geometry-4-33-v1", slug: "dars33-burchak-turlari", lessonTitle: {"uz":"Burchak turlari","ru":"Виды углов","en":"Types of angles"}, skillTags: ["angle-opening","angle-types","degree-boundaries","ray-length-invariant"] };
const CONTENT = {
  "s0": {
    "eyebrow": {
      "uz": "Muammo",
      "ru": "Проблема",
      "en": "Problem"
    },
    "title": {
      "uz": "Uzun nur - katta burchakmi?",
      "ru": "Длинный луч - большой угол?",
      "en": "Does a longer ray mean a larger angle?"
    },
    "scene": "angle-hook",
    "closedSet": true,
    "frames": [
      {
        "uz": "Ikki burchakning ochilishi teng",
        "ru": "Два угла раскрыты одинаково",
        "en": "Two angles have the same opening"
      },
      {
        "uz": "Bir burchak nurlari uzaydi",
        "ru": "Лучи одного угла удлинились",
        "en": "The rays of one angle grow longer"
      },
      {
        "uz": "Ochilish o'zgardimi?",
        "ru": "Изменилось ли раскрытие?",
        "en": "Did the opening change?"
      }
    ],
    "question": {
      "uz": "Qaysi burchak katta?",
      "ru": "Какой угол больше?",
      "en": "Which angle is larger?"
    },
    "options": [
      {
        "uz": "A burchak",
        "ru": "Угол A",
        "en": "Angle A"
      },
      {
        "uz": "B burchak",
        "ru": "Угол B",
        "en": "Angle B"
      },
      {
        "uz": "Ular teng",
        "ru": "Они равны",
        "en": "They are equal"
      }
    ],
    "neutral": {
      "uz": "Taxmin saqlandi. Burchaklarni ochilish va gradus bilan solishtiramiz.",
      "ru": "Гипотеза сохранена. Сравним углы по раскрытию и градусам.",
      "en": "Estimate saved. We will compare angles by opening and degrees."
    },
    "audio": {
      "intro": {
        "uz": [
          "Ikki burchakning ochilishi bir xil ko'rinadi.",
          "Bitta burchakning nurlari uzayadi.",
          "Ochilish o'zgardimi."
        ],
        "ru": [
          "Раскрытие двух углов выглядит одинаково.",
          "Лучи одного угла удлиняются.",
          "Изменилось ли раскрытие?"
        ],
        "en": [
          "The two angles appear to have the same opening.",
          "The rays of one angle grow longer.",
          "Did the opening change?"
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
      "uz": "Burchakning qismlari",
      "ru": "Части угла",
      "en": "Parts of an angle"
    },
    "scene": "angle-parts",
    "frames": [
      {
        "uz": "Uch",
        "ru": "Вершина",
        "en": "Vertex"
      },
      {
        "uz": "Birinchi nur",
        "ru": "Первый луч",
        "en": "First ray"
      },
      {
        "uz": "Ikkinchi nur",
        "ru": "Второй луч",
        "en": "Second ray"
      },
      {
        "uz": "Burchak - ikki nur orasidagi ochilish",
        "ru": "Угол - раскрытие между двумя лучами",
        "en": "An angle is the opening between two rays"
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Ikki nur bitta uchdan chiqqanda ular orasidagi ochilish burchakni hosil qiladi. Uch.",
          "Birinchi nur",
          "Ikkinchi nur.",
          "Burchak degani ikki nur orasidagi ochilish."
        ],
        "ru": [
          "Два луча с общей вершиной образуют угол своим раскрытием. Вершина.",
          "Первый луч",
          "Второй луч.",
          "Угол означает раскрытие между двумя лучами."
        ],
        "en": [
          "Two rays from one vertex form an angle through the opening between them. Vertex.",
          "First ray",
          "Second ray.",
          "An angle is the opening between two rays."
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
      "uz": "90° etalon",
      "ru": "Эталон 90°",
      "en": "The 90° benchmark"
    },
    "scene": "angle-right",
    "frames": [
      {
        "uz": "Go'niya burchagi",
        "ru": "Угол угольника",
        "en": "Set-square angle"
      },
      {
        "uz": "90°",
        "ru": "90°",
        "en": "90°"
      },
      {
        "uz": "To'g'ri burchak",
        "ru": "Прямой угол",
        "en": "Right angle"
      },
      {
        "uz": "Kvadrat belgi",
        "ru": "Квадратная отметка",
        "en": "Square marker"
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "To'qson darajali burchak boshqa burchaklarni tasniflash uchun qulay etalon bo'ladi. Go'niya burchagi.",
          "To'qson daraja",
          "To'g'ri burchak.",
          "Kvadrat belgi."
        ],
        "ru": [
          "Угол в девяносто градусов служит эталоном для классификации других углов. Угол угольника.",
          "Девяносто градусов",
          "Прямой угол.",
          "Квадратная отметка."
        ],
        "en": [
          "A ninety degree angle is the benchmark for classifying other angles. Set square angle.",
          "Ninety degrees",
          "Right angle.",
          "Square marker."
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
      "uz": "90° dan kichik",
      "ru": "Меньше 90°",
      "en": "Less than 90°"
    },
    "scene": "angle-acute",
    "frames": [
      {
        "uz": "Nur yopiladi",
        "ru": "Луч закрывается",
        "en": "The ray closes"
      },
      {
        "uz": "35°",
        "ru": "35°",
        "en": "35°"
      },
      {
        "uz": "35° < 90°",
        "ru": "35° < 90°",
        "en": "35° < 90°"
      },
      {
        "uz": "O'tkir burchak",
        "ru": "Острый угол",
        "en": "Acute angle"
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Ochilish to'g'ri burchakdan kichik bo'lsa burchak o'tkir deyiladi. Nur yopiladi.",
          "O'ttiz besh daraja",
          "O'ttiz besh daraja to'qson darajadan kichik.",
          "O'tkir burchak."
        ],
        "ru": [
          "Если раскрытие меньше прямого угла угол называют острым. Луч закрывается.",
          "Тридцать пять градусов",
          "Тридцать пять градусов меньше девяноста градусов.",
          "Острый угол."
        ],
        "en": [
          "An angle smaller than a right angle is acute. The ray closes.",
          "Thirty five degrees",
          "Thirty five degrees is less than ninety degrees.",
          "Acute angle."
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
      "uz": "90° va 180° orasida",
      "ru": "Между 90° и 180°",
      "en": "Between 90° and 180°"
    },
    "scene": "angle-obtuse",
    "frames": [
      {
        "uz": "Nur keng ochiladi",
        "ru": "Луч раскрывается шире",
        "en": "The ray opens wider"
      },
      {
        "uz": "125°",
        "ru": "125°",
        "en": "125°"
      },
      {
        "uz": "90° < 125° < 180°",
        "ru": "90° < 125° < 180°",
        "en": "90° < 125° < 180°"
      },
      {
        "uz": "O'tmas burchak",
        "ru": "Тупой угол",
        "en": "Obtuse angle"
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Ochilish to'g'ri burchakdan katta ammo yoyiq burchakdan kichik bo'lsa u o'tmasdir. Nur keng ochiladi.",
          "Bir yuz yigirma besh daraja",
          "Bir yuz yigirma besh daraja to'qsondan katta va bir yuz saksondan kichik.",
          "O'tmas burchak."
        ],
        "ru": [
          "Если угол больше прямого но меньше развёрнутого он тупой. Луч раскрывается шире.",
          "Сто двадцать пять градусов",
          "Сто двадцать пять градусов больше девяноста и меньше ста восьмидесяти.",
          "Тупой угол."
        ],
        "en": [
          "An angle greater than a right angle but less than a straight angle is obtuse. The ray opens wider.",
          "One hundred and twenty five degrees",
          "One hundred and twenty five degrees is greater than ninety and less than one hundred and eighty.",
          "Obtuse angle."
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
      "uz": "180°",
      "ru": "180°",
      "en": "180°"
    },
    "scene": "angle-straight",
    "frames": [
      {
        "uz": "Qarama-qarshi nurlar",
        "ru": "Противоположные лучи",
        "en": "Opposite rays"
      },
      {
        "uz": "To'g'ri chiziq",
        "ru": "Прямая линия",
        "en": "Straight line"
      },
      {
        "uz": "180°",
        "ru": "180°",
        "en": "180°"
      },
      {
        "uz": "Yoyiq burchak",
        "ru": "Развёрнутый угол",
        "en": "Straight angle"
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Qarama qarshi nurlar bitta chiziq hosil qilib yoyiq burchakni ko'rsatadi. Qarama qarshi nurlar.",
          "To'g'ri chiziq",
          "Bir yuz sakson daraja.",
          "Yoyiq burchak."
        ],
        "ru": [
          "Противоположные лучи образуют одну линию и показывают развёрнутый угол. Противоположные лучи.",
          "Прямая линия",
          "Сто восемьдесят градусов.",
          "Развёрнутый угол."
        ],
        "en": [
          "Opposite rays form one line and show a straight angle. Opposite rays.",
          "Straight line",
          "One hundred and eighty degrees.",
          "Straight angle."
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
      "uz": "Burchaklar shkalasi",
      "ru": "Шкала углов",
      "en": "Angle scale"
    },
    "scene": "angle-scale",
    "frames": [
      {
        "uz": "0° < α < 90° - o'tkir",
        "ru": "0° < α < 90° - острый",
        "en": "0° < α < 90° - acute"
      },
      {
        "uz": "90° - to'g'ri",
        "ru": "90° - прямой",
        "en": "90° - right"
      },
      {
        "uz": "90° < α < 180° - o'tmas",
        "ru": "90° < α < 180° - тупой",
        "en": "90° < α < 180° - obtuse"
      },
      {
        "uz": "180° - yoyiq",
        "ru": "180° - развёрнутый",
        "en": "180° - straight"
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Burchak turi o'lchovning to'qson va bir yuz sakson darajaga nisbatan joyiga qarab aniqlanadi. Nol darajadan katta va to'qson darajadan kichik burchak o'tkir.",
          "To'qson daraja to'g'ri burchakni bildiradi",
          "To'qson darajadan katta va bir yuz sakson darajadan kichik burchak o'tmas.",
          "Bir yuz sakson daraja yoyiq burchakni bildiradi."
        ],
        "ru": [
          "Вид угла определяется положением его меры относительно девяноста и ста восьмидесяти градусов. Угол больше нуля и меньше девяноста градусов является острым.",
          "Девяносто градусов соответствует прямому углу",
          "Угол больше девяноста и меньше ста восьмидесяти градусов является тупым.",
          "Сто восемьдесят градусов соответствует развёрнутому углу."
        ],
        "en": [
          "An angle greater than zero but less than ninety degrees is acute. Use ninety and one hundred and eighty degrees as benchmarks.",
          "Ninety degrees is a right angle",
          "An angle greater than ninety and less than one hundred and eighty degrees is obtuse.",
          "One hundred and eighty degrees is a straight angle."
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
      "uz": "Ko'cha burilishlari",
      "ru": "Уличные повороты",
      "en": "Street turns"
    },
    "scene": "angle-payoff",
    "frames": [
      {
        "uz": "35°",
        "ru": "35°",
        "en": "35°"
      },
      {
        "uz": "90°",
        "ru": "90°",
        "en": "90°"
      },
      {
        "uz": "125°",
        "ru": "125°",
        "en": "125°"
      },
      {
        "uz": "180°",
        "ru": "180°",
        "en": "180°"
      },
      {
        "uz": "Nur uzunligiga emas, ochilishga qarang",
        "ru": "Смотрите на раскрытие, а не на длину лучей",
        "en": "Look at the opening, not the ray length"
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Ko'cha burilishlarini ochilishiga qarab tartiblash burchak turlarini bitta shkalada birlashtiradi. O'ttiz besh daraja.",
          "To'qson daraja",
          "Bir yuz yigirma besh daraja.",
          "Bir yuz sakson daraja.",
          "Nur uzunligiga emas ochilishga qarang."
        ],
        "ru": [
          "Расположение поворотов улицы по раскрытию объединяет виды углов на одной шкале. Тридцать пять градусов.",
          "Девяносто градусов",
          "Сто двадцать пять градусов.",
          "Сто восемьдесят градусов.",
          "Смотрите на раскрытие а не на длину лучей."
        ],
        "en": [
          "Ordering street turns by opening places all angle types on one scale. Thirty five degrees.",
          "Ninety degrees",
          "One hundred and twenty five degrees.",
          "One hundred and eighty degrees.",
          "Look at the opening not the ray length."
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
      "uz": "35° qaysi tur?",
      "ru": "Какой вид у 35°?",
      "en": "What type is 35°?"
    },
    "scene": "angle-acute",
    "frames": [
      {
        "uz": "35°",
        "ru": "35°",
        "en": "35°"
      },
      {
        "uz": "Burchak turini tanlang",
        "ru": "Выберите вид угла",
        "en": "Choose the angle type"
      }
    ],
    "question": {
      "uz": "35° qaysi tur?",
      "ru": "Какого вида угол 35°?",
      "en": "What type is 35°?"
    },
    "options": [
      {
        "uz": "O'tkir",
        "ru": "Острый",
        "en": "Acute"
      },
      {
        "uz": "To'g'ri",
        "ru": "Прямой",
        "en": "Right"
      },
      {
        "uz": "O'tmas",
        "ru": "Тупой",
        "en": "Obtuse"
      }
    ],
    "correctIndex": 0,
    "closedSet": true,
    "proof": {
      "uz": "35° < 90°, demak o'tkir",
      "ru": "35° < 90°, значит угол острый",
      "en": "35° < 90°, so it is acute"
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. O'ttiz besh daraja to'qson darajadan kichik, demak burchak o'tkir.",
        "ru": "Верно. Тридцать пять градусов меньше девяноста, поэтому угол острый.",
        "en": "Correct. Thirty five degrees is less than ninety degrees so it is acute."
      },
      {
        "uz": "Yana bir qarang: To'g'ri burchak aynan to'qson daraja bo'ladi. O'ttiz besh daraja esa to'qson darajadan kichik.",
        "ru": "Посмотрите ещё раз: Прямой угол равен ровно девяноста градусам. Угол в тридцать пять градусов меньше.",
        "en": "Look again: A right angle is exactly ninety degrees. An angle of thirty five degrees is smaller."
      },
      {
        "uz": "Yana bir qarang: O'tmas burchak to'qson darajadan katta bo'ladi. O'ttiz besh daraja esa to'qson darajadan kichik.",
        "ru": "Посмотрите ещё раз: Тупой угол больше девяноста градусов. Угол в тридцать пять градусов меньше.",
        "en": "Look again: An obtuse angle is greater than ninety degrees. An angle of thirty five degrees is smaller."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Burchak o'ttiz besh gradus.",
          "Bu qaysi turdagi burchak?"
        ],
        "ru": [
          "Угол равен тридцати пяти градусам.",
          "Определите вид этого угла."
        ],
        "en": [
          "The angle measures thirty five degrees.",
          "Identify this angle type."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. O'ttiz besh daraja to'qson darajadan kichik, demak burchak o'tkir.",
        "ru": "Верно. Тридцать пять градусов меньше девяноста, поэтому угол острый.",
        "en": "Correct. Thirty five degrees is less than ninety degrees so it is acute."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. O'ttiz besh daraja to'qson darajadan kichik, demak burchak o'tkir.",
          "ru": "Верно. Тридцать пять градусов меньше девяноста, поэтому угол острый.",
          "en": "Correct. Thirty five degrees is less than ninety degrees so it is acute."
        },
        {
          "uz": "Yana bir qarang: To'g'ri burchak aynan to'qson daraja bo'ladi. O'ttiz besh daraja esa to'qson darajadan kichik.",
          "ru": "Посмотрите ещё раз: Прямой угол равен ровно девяноста градусам. Угол в тридцать пять градусов меньше.",
          "en": "Look again: A right angle is exactly ninety degrees. An angle of thirty five degrees is smaller."
        },
        {
          "uz": "Yana bir qarang: O'tmas burchak to'qson darajadan katta bo'ladi. O'ttiz besh daraja esa to'qson darajadan kichik.",
          "ru": "Посмотрите ещё раз: Тупой угол больше девяноста градусов. Угол в тридцать пять градусов меньше.",
          "en": "Look again: An obtuse angle is greater than ninety degrees. An angle of thirty five degrees is smaller."
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
      "uz": "90° qaysi tur?",
      "ru": "Какой вид у 90°?",
      "en": "What type is 90°?"
    },
    "scene": "angle-right",
    "frames": [
      {
        "uz": "90°",
        "ru": "90°",
        "en": "90°"
      },
      {
        "uz": "Burchak turini tanlang",
        "ru": "Выберите вид угла",
        "en": "Choose the angle type"
      }
    ],
    "question": {
      "uz": "90° qaysi tur?",
      "ru": "Какого вида угол 90°?",
      "en": "What type is 90°?"
    },
    "options": [
      {
        "uz": "O'tkir",
        "ru": "Острый",
        "en": "Acute"
      },
      {
        "uz": "To'g'ri",
        "ru": "Прямой",
        "en": "Right"
      },
      {
        "uz": "Yoyiq",
        "ru": "Развёрнутый",
        "en": "Straight"
      }
    ],
    "correctIndex": 1,
    "closedSet": true,
    "proof": {
      "uz": "90° - to'g'ri burchak",
      "ru": "90° - прямой угол",
      "en": "90° is a right angle"
    },
    "feedbackAudio": [
      {
        "uz": "Yana bir qarang: O'tkir burchak to'qson darajadan kichik bo'ladi. Bu burchak esa aynan to'qson daraja.",
        "ru": "Посмотрите ещё раз: Острый угол меньше девяноста градусов. Этот угол равен ровно девяноста градусам.",
        "en": "Look again: An acute angle is less than ninety degrees. This angle is exactly ninety degrees."
      },
      {
        "uz": "To'g'ri. To'qson daraja degani to'g'ri burchak.",
        "ru": "Верно. Девяносто градусов означает прямой угол.",
        "en": "Correct. Ninety degrees is a right angle."
      },
      {
        "uz": "Yana bir qarang: Yoyiq burchak aynan bir yuz sakson daraja bo'ladi. Bu burchak esa to'qson daraja.",
        "ru": "Посмотрите ещё раз: Развёрнутый угол равен ровно ста восьмидесяти градусам. Этот угол равен девяноста градусам.",
        "en": "Look again: A straight angle is exactly one hundred and eighty degrees. This angle is ninety degrees."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Burchak to'qson gradus.",
          "Mos nomni tanlang."
        ],
        "ru": [
          "Угол равен девяноста градусам.",
          "Выберите подходящее название."
        ],
        "en": [
          "The angle measures ninety degrees.",
          "Choose the matching name."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. To'qson daraja degani to'g'ri burchak.",
        "ru": "Верно. Девяносто градусов означает прямой угол.",
        "en": "Correct. Ninety degrees is a right angle."
      },
      "on_wrong": [
        {
          "uz": "Yana bir qarang: O'tkir burchak to'qson darajadan kichik bo'ladi. Bu burchak esa aynan to'qson daraja.",
          "ru": "Посмотрите ещё раз: Острый угол меньше девяноста градусов. Этот угол равен ровно девяноста градусам.",
          "en": "Look again: An acute angle is less than ninety degrees. This angle is exactly ninety degrees."
        },
        {
          "uz": "To'g'ri. To'qson daraja degani to'g'ri burchak.",
          "ru": "Верно. Девяносто градусов означает прямой угол.",
          "en": "Correct. Ninety degrees is a right angle."
        },
        {
          "uz": "Yana bir qarang: Yoyiq burchak aynan bir yuz sakson daraja bo'ladi. Bu burchak esa to'qson daraja.",
          "ru": "Посмотрите ещё раз: Развёрнутый угол равен ровно ста восьмидесяти градусам. Этот угол равен девяноста градусам.",
          "en": "Look again: A straight angle is exactly one hundred and eighty degrees. This angle is ninety degrees."
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
      "uz": "125° qaysi tur?",
      "ru": "Какой вид у 125°?",
      "en": "What type is 125°?"
    },
    "scene": "angle-obtuse",
    "frames": [
      {
        "uz": "125°",
        "ru": "125°",
        "en": "125°"
      },
      {
        "uz": "Burchak turini tanlang",
        "ru": "Выберите вид угла",
        "en": "Choose the angle type"
      }
    ],
    "question": {
      "uz": "125° qaysi tur?",
      "ru": "Какого вида угол 125°?",
      "en": "What type is 125°?"
    },
    "options": [
      {
        "uz": "To'g'ri",
        "ru": "Прямой",
        "en": "Right"
      },
      {
        "uz": "O'tmas",
        "ru": "Тупой",
        "en": "Obtuse"
      },
      {
        "uz": "Yoyiq",
        "ru": "Развёрнутый",
        "en": "Straight"
      }
    ],
    "correctIndex": 1,
    "closedSet": true,
    "proof": {
      "uz": "90° < 125° < 180°, demak o'tmas",
      "ru": "90° < 125° < 180°, значит угол тупой",
      "en": "90° < 125° < 180°, so it is obtuse"
    },
    "feedbackAudio": [
      {
        "uz": "Yana bir qarang: To'g'ri burchak aynan to'qson daraja bo'ladi. Bir yuz yigirma besh daraja esa undan katta.",
        "ru": "Посмотрите ещё раз: Прямой угол равен ровно девяноста градусам. Угол в сто двадцать пять градусов больше.",
        "en": "Look again: A right angle is exactly ninety degrees. An angle of one hundred and twenty five degrees is greater."
      },
      {
        "uz": "To'g'ri. Bir yuz yigirma besh daraja to'qsondan katta va bir yuz saksondan kichik, demak burchak o'tmas.",
        "ru": "Верно. Сто двадцать пять градусов больше девяноста и меньше ста восьмидесяти, поэтому угол тупой.",
        "en": "Correct. One hundred and twenty five degrees is greater than ninety and less than one hundred and eighty, so it is obtuse."
      },
      {
        "uz": "Yana bir qarang: Yoyiq burchak aynan bir yuz sakson daraja. Bir yuz yigirma besh daraja esa to'qson bilan bir yuz sakson orasida.",
        "ru": "Посмотрите ещё раз: Развёрнутый угол равен ста восьмидесяти градусам. Сто двадцать пять градусов находятся между девяноста и ста восьмьюдесятью.",
        "en": "Look again: A straight angle is exactly one hundred and eighty degrees. One hundred and twenty five degrees lies between ninety and one hundred and eighty."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Burchak bir yuz yigirma besh gradus.",
          "Bu burchak qanday ataladi?"
        ],
        "ru": [
          "Угол равен ста двадцати пяти градусам.",
          "Как называется этот угол?"
        ],
        "en": [
          "The angle measures one hundred and twenty five degrees.",
          "What is this angle called?"
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Bir yuz yigirma besh daraja to'qsondan katta va bir yuz saksondan kichik, demak burchak o'tmas.",
        "ru": "Верно. Сто двадцать пять градусов больше девяноста и меньше ста восьмидесяти, поэтому угол тупой.",
        "en": "Correct. One hundred and twenty five degrees is greater than ninety and less than one hundred and eighty, so it is obtuse."
      },
      "on_wrong": [
        {
          "uz": "Yana bir qarang: To'g'ri burchak aynan to'qson daraja bo'ladi. Bir yuz yigirma besh daraja esa undan katta.",
          "ru": "Посмотрите ещё раз: Прямой угол равен ровно девяноста градусам. Угол в сто двадцать пять градусов больше.",
          "en": "Look again: A right angle is exactly ninety degrees. An angle of one hundred and twenty five degrees is greater."
        },
        {
          "uz": "To'g'ri. Bir yuz yigirma besh daraja to'qsondan katta va bir yuz saksondan kichik, demak burchak o'tmas.",
          "ru": "Верно. Сто двадцать пять градусов больше девяноста и меньше ста восьмидесяти, поэтому угол тупой.",
          "en": "Correct. One hundred and twenty five degrees is greater than ninety and less than one hundred and eighty, so it is obtuse."
        },
        {
          "uz": "Yana bir qarang: Yoyiq burchak aynan bir yuz sakson daraja. Bir yuz yigirma besh daraja esa to'qson bilan bir yuz sakson orasida.",
          "ru": "Посмотрите ещё раз: Развёрнутый угол равен ста восьмидесяти градусам. Сто двадцать пять градусов находятся между девяноста и ста восьмьюдесятью.",
          "en": "Look again: A straight angle is exactly one hundred and eighty degrees. One hundred and twenty five degrees lies between ninety and one hundred and eighty."
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
      "uz": "180° qaysi tur?",
      "ru": "Какой вид у 180°?",
      "en": "What type is 180°?"
    },
    "scene": "angle-straight",
    "frames": [
      {
        "uz": "180°",
        "ru": "180°",
        "en": "180°"
      },
      {
        "uz": "Burchak turini tanlang",
        "ru": "Выберите вид угла",
        "en": "Choose the angle type"
      }
    ],
    "question": {
      "uz": "180° qaysi tur?",
      "ru": "Какого вида угол 180°?",
      "en": "What type is 180°?"
    },
    "options": [
      {
        "uz": "O'tkir",
        "ru": "Острый",
        "en": "Acute"
      },
      {
        "uz": "O'tmas",
        "ru": "Тупой",
        "en": "Obtuse"
      },
      {
        "uz": "Yoyiq",
        "ru": "Развёрнутый",
        "en": "Straight"
      }
    ],
    "correctIndex": 2,
    "closedSet": true,
    "proof": {
      "uz": "180° - yoyiq burchak",
      "ru": "180° - развёрнутый угол",
      "en": "180° is a straight angle"
    },
    "feedbackAudio": [
      {
        "uz": "Yana bir qarang: O'tkir burchak to'qson darajadan kichik bo'ladi. Bir yuz sakson daraja bu oraliqqa kirmaydi.",
        "ru": "Посмотрите ещё раз: Острый угол меньше девяноста градусов. Угол в сто восемьдесят градусов не входит в этот диапазон.",
        "en": "Look again: An acute angle is less than ninety degrees. An angle of one hundred and eighty degrees is outside that range."
      },
      {
        "uz": "Yana bir qarang: O'tmas burchak to'qson darajadan katta, lekin bir yuz saksondan kichik. Bir yuz sakson daraja chegaraning o'zi.",
        "ru": "Посмотрите ещё раз: Тупой угол больше девяноста, но меньше ста восьмидесяти градусов. Сто восемьдесят градусов являются границей.",
        "en": "Look again: An obtuse angle is greater than ninety but less than one hundred and eighty degrees. One hundred and eighty is the boundary."
      },
      {
        "uz": "To'g'ri. Bir yuz sakson daraja degani yoyiq burchak.",
        "ru": "Верно. Сто восемьдесят градусов означает развёрнутый угол.",
        "en": "Correct. One hundred and eighty degrees is a straight angle."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Burchak bir yuz sakson gradus.",
          "Burchakning turini aniqlang."
        ],
        "ru": [
          "Угол равен ста восьмидесяти градусам.",
          "Определите тип угла."
        ],
        "en": [
          "The angle measures one hundred and eighty degrees.",
          "Identify the type of angle."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Bir yuz sakson daraja degani yoyiq burchak.",
        "ru": "Верно. Сто восемьдесят градусов означает развёрнутый угол.",
        "en": "Correct. One hundred and eighty degrees is a straight angle."
      },
      "on_wrong": [
        {
          "uz": "Yana bir qarang: O'tkir burchak to'qson darajadan kichik bo'ladi. Bir yuz sakson daraja bu oraliqqa kirmaydi.",
          "ru": "Посмотрите ещё раз: Острый угол меньше девяноста градусов. Угол в сто восемьдесят градусов не входит в этот диапазон.",
          "en": "Look again: An acute angle is less than ninety degrees. An angle of one hundred and eighty degrees is outside that range."
        },
        {
          "uz": "Yana bir qarang: O'tmas burchak to'qson darajadan katta, lekin bir yuz saksondan kichik. Bir yuz sakson daraja chegaraning o'zi.",
          "ru": "Посмотрите ещё раз: Тупой угол больше девяноста, но меньше ста восьмидесяти градусов. Сто восемьдесят градусов являются границей.",
          "en": "Look again: An obtuse angle is greater than ninety but less than one hundred and eighty degrees. One hundred and eighty is the boundary."
        },
        {
          "uz": "To'g'ri. Bir yuz sakson daraja degani yoyiq burchak.",
          "ru": "Верно. Сто восемьдесят градусов означает развёрнутый угол.",
          "en": "Correct. One hundred and eighty degrees is a straight angle."
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
      "uz": "Bit nurlarni o'lchadi",
      "ru": "Бит измерил лучи",
      "en": "Bit measured the rays"
    },
    "scene": "angle-equal",
    "frames": [
      {
        "uz": "Bit: uzun nurli burchak kattaroq",
        "ru": "Бит: угол с длинными лучами больше",
        "en": "Bit: the angle with longer rays is larger"
      },
      {
        "uz": "Bitning xatosini toping",
        "ru": "Найдите ошибку Бита",
        "en": "Find Bit's mistake"
      }
    ],
    "question": {
      "uz": "Burchak kattaligini nima belgilaydi?",
      "ru": "Что определяет величину угла?",
      "en": "What determines the angle size?"
    },
    "options": [
      {
        "uz": "Nur uzunligi",
        "ru": "Длина лучей",
        "en": "Ray length"
      },
      {
        "uz": "Burchakning ochilishi",
        "ru": "Раскрытие угла",
        "en": "Angle opening"
      },
      {
        "uz": "Rasmning kattaligi",
        "ru": "Размер рисунка",
        "en": "Drawing size"
      }
    ],
    "correctIndex": 1,
    "closedSet": true,
    "proof": {
      "uz": "Burchakni nurlar orasidagi ochilish belgilaydi",
      "ru": "Раскрытие между лучами определяет величину угла",
      "en": "The opening between the rays determines the angle"
    },
    "feedbackAudio": [
      {
        "uz": "Yana bir qarang: Nurni uzaytirish faqat uning uzunligini o'zgartiradi. Nurlar orasidagi ochilish o'zgarmaydi.",
        "ru": "Посмотрите ещё раз: Удлинение луча меняет только его длину. Раскрытие между лучами не изменяется.",
        "en": "Look again: Extending a ray changes only its length. The opening between the rays stays unchanged."
      },
      {
        "uz": "To'g'ri. Burchakni nurlar orasidagi ochilish belgilaydi.",
        "ru": "Верно. Угол определяет раскрытие между лучами.",
        "en": "Correct. The opening between the rays determines the angle."
      },
      {
        "uz": "Yana bir qarang: Rasmni kattalashtirish nurlar orasidagi ochilishni o'zgartirmaydi. Burchak kattaligi chizma o'lchamiga bog'liq emas.",
        "ru": "Посмотрите ещё раз: Увеличение рисунка не меняет раскрытие между лучами. Величина угла не зависит от размера рисунка.",
        "en": "Look again: Enlarging the drawing does not change the opening between the rays. Angle size does not depend on drawing size."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Bit uzunroq nurli burchak kattaroq deb o'yladi.",
          "Bitning xatosini toping."
        ],
        "ru": [
          "Бит решил, что угол с более длинными лучами больше.",
          "Найдите ошибку Бита."
        ],
        "en": [
          "Bit thinks the angle with longer rays is larger.",
          "Find Bit's mistake."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Burchakni nurlar orasidagi ochilish belgilaydi.",
        "ru": "Верно. Раскрытие между лучами определяет величину угла.",
        "en": "Correct. The opening between the rays determines the angle."
      },
      "on_wrong": [
        {
          "uz": "Yana bir qarang: Nurni uzaytirish faqat uning uzunligini o'zgartiradi. Nurlar orasidagi ochilish o'zgarmaydi.",
          "ru": "Посмотрите ещё раз: Удлинение луча меняет только его длину. Раскрытие между лучами не изменяется.",
          "en": "Look again: Extending a ray changes only its length. The opening between the rays stays unchanged."
        },
        {
          "uz": "To'g'ri. Burchakni nurlar orasidagi ochilish belgilaydi.",
          "ru": "Верно. Раскрытие между лучами определяет величину угла.",
          "en": "Correct. The opening between the rays determines the angle."
        },
        {
          "uz": "Yana bir qarang: Rasmni kattalashtirish nurlar orasidagi ochilishni o'zgartirmaydi. Burchak kattaligi chizma o'lchamiga bog'liq emas.",
          "ru": "Посмотрите ещё раз: Увеличение рисунка не меняет раскрытие между лучами. Величина угла не зависит от размера рисунка.",
          "en": "Look again: Enlarging the drawing does not change the opening between the rays. Angle size does not depend on drawing size."
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
      "uz": "Yo'l chorrahasi",
      "ru": "Дорожный перекрёсток",
      "en": "Road junction"
    },
    "scene": "angle-case",
    "frames": [
      {
        "uz": "Yo'l burilishi: 110°",
        "ru": "Поворот дороги: 110°",
        "en": "Road turn: 110°"
      },
      {
        "uz": "110° ni 90° va 180° bilan solishtiring",
        "ru": "Сравните 110° с 90° и 180°",
        "en": "Compare 110° with 90° and 180°"
      },
      {
        "uz": "Burchak turini tanlang",
        "ru": "Выберите вид угла",
        "en": "Choose the angle type"
      }
    ],
    "question": {
      "uz": "110° qaysi tur?",
      "ru": "Какого вида угол 110°?",
      "en": "What type is 110°?"
    },
    "options": [
      {
        "uz": "O'tkir",
        "ru": "Острый",
        "en": "Acute"
      },
      {
        "uz": "To'g'ri",
        "ru": "Прямой",
        "en": "Right"
      },
      {
        "uz": "O'tmas",
        "ru": "Тупой",
        "en": "Obtuse"
      }
    ],
    "correctIndex": 2,
    "closedSet": true,
    "proof": {
      "uz": "90° < 110° < 180°, demak o'tmas",
      "ru": "90° < 110° < 180°, значит угол тупой",
      "en": "90° < 110° < 180°, so it is obtuse"
    },
    "feedbackAudio": [
      {
        "uz": "Yana bir qarang: O'tkir burchak to'qson darajadan kichik bo'ladi. Bir yuz o'n daraja esa undan katta.",
        "ru": "Посмотрите ещё раз: Острый угол меньше девяноста градусов. Угол в сто десять градусов больше.",
        "en": "Look again: An acute angle is less than ninety degrees. An angle of one hundred and ten degrees is greater."
      },
      {
        "uz": "Yana bir qarang: To'g'ri burchak aynan to'qson daraja. Bir yuz o'n daraja undan yigirma daraja katta.",
        "ru": "Посмотрите ещё раз: Прямой угол равен ровно девяноста градусам. Угол в сто десять градусов больше него на двадцать.",
        "en": "Look again: A right angle is exactly ninety degrees. An angle of one hundred and ten degrees is twenty degrees greater."
      },
      {
        "uz": "To'g'ri. Bir yuz o'n daraja to'qsondan katta va bir yuz saksondan kichik, demak burchak o'tmas.",
        "ru": "Верно. Сто десять градусов больше девяноста и меньше ста восьмидесяти, поэтому угол тупой.",
        "en": "Correct. One hundred and ten degrees is greater than ninety and less than one hundred and eighty, so it is obtuse."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Yo'l burilishi bir yuz o'n gradus.",
          "Bir yuz o'n gradusni to'qson va bir yuz sakson gradus bilan solishtiring.",
          "Yo'l burilishi qaysi turga kiradi?"
        ],
        "ru": [
          "Дорожный поворот равен ста десяти градусам.",
          "Сравните сто десять градусов с девяноста и ста восьмьюдесятью градусами.",
          "К какому виду относится поворот?"
        ],
        "en": [
          "The road turn measures one hundred and ten degrees.",
          "Compare one hundred and ten degrees with ninety and one hundred and eighty degrees.",
          "Which angle type describes the turn?"
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Bir yuz o'n daraja to'qsondan katta va bir yuz saksondan kichik, demak burchak o'tmas.",
        "ru": "Верно. Сто десять градусов больше девяноста и меньше ста восьмидесяти, поэтому угол тупой.",
        "en": "Correct. One hundred and ten degrees is greater than ninety and less than one hundred and eighty, so it is obtuse."
      },
      "on_wrong": [
        {
          "uz": "Yana bir qarang: O'tkir burchak to'qson darajadan kichik bo'ladi. Bir yuz o'n daraja esa undan katta.",
          "ru": "Посмотрите ещё раз: Острый угол меньше девяноста градусов. Угол в сто десять градусов больше.",
          "en": "Look again: An acute angle is less than ninety degrees. An angle of one hundred and ten degrees is greater."
        },
        {
          "uz": "Yana bir qarang: To'g'ri burchak aynan to'qson daraja. Bir yuz o'n daraja undan yigirma daraja katta.",
          "ru": "Посмотрите ещё раз: Прямой угол равен ровно девяноста градусам. Угол в сто десять градусов больше него на двадцать.",
          "en": "Look again: A right angle is exactly ninety degrees. An angle of one hundred and ten degrees is twenty degrees greater."
        },
        {
          "uz": "To'g'ri. Bir yuz o'n daraja to'qsondan katta va bir yuz saksondan kichik, demak burchak o'tmas.",
          "ru": "Верно. Сто десять градусов больше девяноста и меньше ста восьмидесяти, поэтому угол тупой.",
          "en": "Correct. One hundred and ten degrees is greater than ninety and less than one hundred and eighty, so it is obtuse."
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
      "uz": "Burchaklar kompassi",
      "ru": "Компас углов",
      "en": "Angle compass"
    },
    "scene": "angle-final",
    "frames": [
      {
        "uz": "Ochilish",
        "ru": "Раскрытие",
        "en": "Opening"
      },
      {
        "uz": "90° dan kichik - o'tkir",
        "ru": "Меньше 90° - острый",
        "en": "Less than 90° - acute"
      },
      {
        "uz": "90° ga teng - to'g'ri",
        "ru": "Равно 90° - прямой",
        "en": "Equal to 90° - right"
      },
      {
        "uz": "90° < α < 180° - o'tmas; 180° - yoyiq",
        "ru": "90° < α < 180° - тупой; 180° - развёрнутый",
        "en": "90° < α < 180° - obtuse; 180° - straight"
      },
      {
        "uz": "Keyingi mavzu: burchak yasash",
        "ru": "Следующая тема: построение углов",
        "en": "Next topic: constructing angles"
      }
    ],
    "rewardTitle": {
      "uz": "Burchaklar tasnifchisi",
      "ru": "Классификатор углов",
      "en": "Angle classifier"
    },
    "audio": {
      "intro": {
        "uz": [
          "Burchaklarni tasniflashda yagona mezon nurlar orasidagi ochilishdir. Ochilish.",
          "To'qson darajadan kichik burchak o'tkir",
          "To'qson darajaga teng burchak to'g'ri.",
          "To'qson darajadan katta va bir yuz sakson darajadan kichik burchak o'tmas bir yuz sakson daraja yoyiq burchakni bildiradi.",
          "Keyingi mavzu burchak yasash."
        ],
        "ru": [
          "Единственный критерий классификации углов это раскрытие между лучами. Раскрытие.",
          "Угол меньше девяноста градусов является острым",
          "Равно девяносто градусов соответствует прямому углу.",
          "Угол больше девяноста и меньше ста восьмидесяти градусов является тупым сто восемьдесят градусов соответствует развёрнутому углу.",
          "Следующая тема построение углов."
        ],
        "en": [
          "The opening between the rays is the single criterion for classifying angles. Opening.",
          "An angle less than ninety degrees is acute",
          "Equal to ninety degrees is a right angle.",
          "An angle between ninety and one hundred and eighty degrees is obtuse. At one hundred and eighty degrees, it is straight.",
          "Next topic constructing angles."
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
const ANGLE_DEGREES = { 'angle-acute':35,'angle-right':90,'angle-obtuse':125,'angle-straight':180,'angle-case':110,'angle-payoff':frame=>[35,90,125,180][Math.min(frame,3)],'angle-equal':55,'angle-hook':55 };
function AngleScene({ scene, frame, p }) {
  if (['angle-scale','angle-final'].includes(scene)) return <svg viewBox="0 0 300 175"><path className="tv-scale acute" d="M30 130A120 120 0 0 1 150 10"/><path className="tv-scale obtuse" d="M150 10A120 120 0 0 1 270 130"/><circle className="tv-pulse" cx={30+240*p} cy="130" r="9"/><path className="tv-grid" d="M30 130H270 M150 10V130"/></svg>;
  if (scene === 'angle-parts') return <svg viewBox="0 0 300 175"><path className="tv-ray" d="M145 125H260" style={{opacity:frame>0?1:.22}}/><path className="tv-ray" d="M145 125L82 43" style={{opacity:frame>1?1:.22}}/><circle className="tv-pulse" cx="145" cy="125" r={frame===0?12:7}/><path className="tv-arc" d="M185 125A40 40 0 0 0 121 93" style={{opacity:frame>2?1:.2}}/></svg>;
  if (scene === 'angle-payoff') { const degrees=Array.from({length:4},(_,i)=>ANGLE_DEGREES['angle-payoff'](i)); return <svg viewBox="0 0 300 175">{degrees.map((degree,i)=>{const rad=degree*Math.PI/180;const ox=39+i*74;const oy=118;const length=42;const arc=17;return <g key={degree} style={{opacity:i<=Math.min(frame,3)?1:.16,transition:'opacity .45s'}}><path className="tv-ray" d={`M${ox} ${oy}h${length}`}/><path className="tv-ray" d={`M${ox} ${oy}L${ox+length*Math.cos(rad)} ${oy-length*Math.sin(rad)}`}/><path className="tv-arc" d={`M${ox+arc} ${oy}A${arc} ${arc} 0 ${degree>180?1:0} 0 ${ox+arc*Math.cos(rad)} ${oy-arc*Math.sin(rad)}`}/><text x={ox} y="153" textAnchor="middle">{degree}°</text></g>})}{frame>3&&<circle className="tv-pulse" cx="150" cy="80" r="8"/>}</svg>; }
  const degreeSource = ANGLE_DEGREES[scene]; const degree = typeof degreeSource === 'function' ? degreeSource(frame) : degreeSource || 60; const equalOpening=['angle-hook','angle-equal'].includes(scene); const shown = equalOpening?degree:degree*Math.max(.18,p); const rad=shown*Math.PI/180; const x=145+96*Math.cos(rad); const y=125-96*Math.sin(rad); if (equalOpening) { const short=48+14*p; const long=58+38*p; return <svg viewBox="0 0 300 175"><g transform="translate(-55 0)"><path className="tv-ray" d={`M145 125h${short}`}/><path className="tv-ray" d={`M145 125L${145+short*Math.cos(rad)} ${125-short*Math.sin(rad)}`}/></g><g transform="translate(80 0)"><path className="tv-ray" d={`M145 125h${long}`}/><path className="tv-ray" d={`M145 125L${145+long*Math.cos(rad)} ${125-long*Math.sin(rad)}`}/></g></svg>; } return <svg viewBox="0 0 300 175"><path className="tv-ray" d="M145 125H260"/><path className="tv-ray" d={`M145 125L${x} ${y}`}/><path className="tv-arc" d={`M185 125A40 40 0 0 0 ${145+40*Math.cos(rad)} ${125-40*Math.sin(rad)}`}/><circle className="tv-pulse" cx="145" cy="125" r="7"/></svg>;
}
const PROTRACTOR_DEGREES = {'protractor-hook':frame=>frame>0?120:60,'protractor-zero':()=>70,'protractor-start':()=>70,'protractor-mark':()=>70,'protractor-obtuse':()=>120,'protractor-check':()=>70,'protractor-rule':()=>70,'protractor-centre':()=>70,'protractor-order':()=>70,'protractor-error':frame=>frame>0?50:130,'protractor-case':()=>135,'protractor-final':()=>70,'protractor-parts':()=>90};
function ProtractorScene({ scene, frame, p }) { const degree=(PROTRACTOR_DEGREES[scene]||(()=>70))(frame); const rad=degree*Math.PI/180; const x=145+96*Math.cos(rad); const y=125-96*Math.sin(rad); return <svg viewBox="0 0 300 175"><path className="tv-protractor" d="M45 125A100 100 0 0 1 245 125"/><path className="tv-grid" d="M45 125H245 M145 25V125"/><path className="tv-ray" d="M145 125H260"/><circle className="tv-pulse" cx="145" cy="125" r={frame===0?10:6}/>{frame>0&&<circle className="tv-mark" cx={x} cy={y} r="7"/>}{frame>1&&<path className="tv-ray" d={`M145 125L${x} ${y}`}/>}<path className="tv-arc" d={`M185 125A40 40 0 0 0 ${145+40*Math.cos(rad*p)} ${125-40*Math.sin(rad*p)}`} style={{opacity:frame>1?1:.25}}/></svg>; }
function TriangleScene({ scene, frame, p }) { const variant=scene.includes('equal')?'equal':scene.includes('iso')||scene.includes('hook')||scene.includes('case')||scene.includes('payoff')?'iso':scene.includes('right')?'right':scene.includes('angles')?'angles':'scalene'; if(variant==='angles') return <svg viewBox="0 0 300 175"><polygon className="tv-shape" points="20,140 78,54 136,140" style={{opacity:frame>=0?1:.15}}/><polygon className="tv-shape" points="98,140 98,54 182,140" style={{opacity:frame>0?1:.15}}/><polygon className="tv-shape" points="164,140 211,82 282,140" style={{opacity:frame>1?1:.15}}/>{frame>2&&<circle className="tv-pulse" cx="150" cy="86" r="10"/>}</svg>; const points=variant==='right'?'65,140 65,40 245,140':variant==='equal'?'55,140 150,28 245,140':variant==='iso'?'45,140 150,42 255,140':'38,140 122,35 264,140'; const rotate=scene==='triangle-rotate'?90*p:0; const early=scene==='triangle-case'?0:1; return <svg viewBox="0 0 300 175"><g style={{transformOrigin:'150px 95px',transform:`rotate(${rotate}deg)`,transition:'transform .6s ease'}}><polygon className="tv-shape" points={points}/><path className="tv-path" d="M86 94l12 8" style={{opacity:frame>=early?1:.16}}/><path className="tv-path" d="M202 102l12-8" style={{opacity:frame>early?1:.16}}/>{variant==='equal'&&<path className="tv-path" d="M142 140v-14" style={{opacity:frame>early+1?1:.16}}/>}{(variant==='right'||scene.includes('case')||scene.includes('hook')||scene.includes('payoff'))&&<path className="tv-right" d="M65 120h20v20" style={{opacity:frame>0?1:.16}}/>}{frame>3&&<circle className="tv-pulse" cx="150" cy="78" r="10"/>}</g></svg>; }
function QuadScene({ scene, frame, p }) { if(['quad-hook','quad-compare','quad-final'].includes(scene)) return <svg viewBox="0 0 300 175"><rect className="tv-shape" x="20" y="54" width="145" height="82"/><rect className="tv-shape accent" x={145-30*p} y={40-8*p} width="105" height="105"/><path className="tv-right" d="M20 72h18V54 M232 40v18h18"/></svg>; if(scene==='quad-rhombus') return <svg viewBox="0 0 300 175"><polygon className="tv-shape" points="150,24 260,88 150,152 40,88"/><path className="tv-path" d="M88 58l10 12 M202 70l10-12 M88 118l10-12 M202 106l10 12" style={{opacity:frame>0?1:.18}}/></svg>; const square=['quad-square','quad-rotated','quad-case','quad-payoff'].includes(scene); const rotate=scene==='quad-rotated'?45*p:0; const marks=Math.min(4,frame+1); return <svg viewBox="0 0 300 175"><g style={{transformOrigin:'150px 88px',transform:`rotate(${rotate}deg)`,transition:'transform .6s ease'}}><rect className="tv-shape" x={square?90:44} y={square?28:48} width={square?120:212} height={square?120:92}/>{marks>0&&<path className="tv-right" d={square?'M90 48h20V28':'M44 68h20V48'}/>} {marks>1&&<path className="tv-right" d={square?'M190 28v20h20':'M236 48v20h20'}/>} {marks>2&&<path className="tv-right" d={square?'M210 128h-20v20':'M256 120h-20v20'}/>} {marks>3&&<path className="tv-right" d={square?'M110 148v-20H90':'M64 140v-20H44'}/>}</g>{frame>3&&<circle className="tv-pulse" cx="150" cy="88" r="10"/>}</svg>; }
function PerimeterScene({ scene, frame, p, screen }) { if(scene==='perimeter-compare') return <svg viewBox="0 0 300 180"><rect className="tv-border" x="20" y="45" width="120" height="58" style={{strokeDashoffset:420*(1-p)}}/><rect className="tv-border" x="160" y="33" width="100" height="82" style={{strokeDashoffset:420*(1-p)}}/><g className="tv-cells"><rect className="tv-cell" x="165" y="38" width="90" height="72" style={{opacity:frame > 0 ? .55 : .08}}/></g></svg>; const dims=screen===0||screen===7?[8,5]:screen===8||screen===9?[7,4]:screen===10?[6,6]:screen===12?[7,5]:screen===13?[10,6]:[6,4]; const cols=Math.min(10,dims[0]); const rows=Math.min(6,dims[1]); const cells=cols*rows; const area=scene.includes('area')||scene==='perimeter-case'||scene==='perimeter-hook'||scene==='perimeter-payoff'||scene==='perimeter-meaning'||scene==='perimeter-final'; const border=!scene.includes('area')||scene==='perimeter-case'||scene==='perimeter-hook'||scene==='perimeter-payoff'||scene==='perimeter-meaning'||scene==='perimeter-final'; return <svg viewBox="0 0 300 180">{area&&Array.from({length:cells},(_,i)=>{const col=i%cols,row=Math.floor(i/cols);return <rect className="tv-cell" key={i} x={58+col*184/cols} y={38+row*99/rows} width={184/cols-1} height={99/rows-1} style={{opacity:i < Math.ceil(cells*p) ? .62 : .08}}/>})}{border&&<rect className="tv-border" x="55" y="35" width="190" height="105" style={{strokeDashoffset:590*(1-p)}}/>}{scene==='perimeter-case'&&<rect className="tv-pool" x="132" y="82" width="46" height="31"/>}</svg>; }
function LessonVisual({ scene, frame, screen }) { const t=useT(); const c=CONTENT[`s${screen}`]; const safeFrame=Math.min(frame,c.frames.length-1); const label=t(c.frames[safeFrame]); const p=(safeFrame+1)/FRAME_COUNTS[screen]; let visual; if(LESSON_KIND==='measure') visual=<MeasureScene scene={scene} frame={safeFrame} p={p}/>; else if(LESSON_KIND==='volume') visual=<VolumeScene scene={scene} frame={safeFrame} p={p}/>; else if(LESSON_KIND==='angle') visual=<AngleScene scene={scene} frame={safeFrame} p={p}/>; else if(LESSON_KIND==='protractor') visual=<ProtractorScene scene={scene} frame={safeFrame} p={p}/>; else if(LESSON_KIND==='triangle') visual=<TriangleScene scene={scene} frame={safeFrame} p={p}/>; else if(LESSON_KIND==='quadrilateral') visual=<QuadScene scene={scene} frame={safeFrame} p={p}/>; else visual=<PerimeterScene scene={scene} frame={safeFrame} p={p} screen={screen}/>; return <div className={`conversion-visual topic-visual ${LESSON_KIND}-visual scene-${scene}`} aria-label={label}>{visual}<strong>{label}</strong></div>; }
const RevealFrames = ({ frames, frame }) => { const t = useT(); return <div className="reveal-grid">{frames.map((item, index) => <div className={index <= frame ? 'reveal-card show' : 'reveal-card'} key={index}><b>{index + 1}</b><span>{t(item)}</span></div>)}</div>; };
const GuidedFramePanel = ({ frames, step, onAdvance, audioReady }) => { const t = useT(); const complete = step >= frames.length - 1; return <div className="guided-panel" aria-live="polite"><div className="guided-progress" aria-label={`${step + 1} / ${frames.length}`}>{frames.map((_, index) => <i className={index <= step ? 'active' : ''} key={index}/>)}</div><div className="guided-frame"><b>{step + 1}</b><span>{t(frames[step])}</span></div><div className="guided-action">{complete ? <span className="guided-complete">✓ {t(bi('Bosqichlar tugadi', 'Шаги завершены', 'Steps complete'))}</span> : <button type="button" className="btn-white-accent step-button" disabled={!audioReady} onClick={onAdvance}>{t(bi('Keyingi qadam', 'Следующий шаг', 'Next step'))} →</button>}</div></div>; };
function HookScreen({ screen, storedAnswer, onAnswer, onPrev, onNext }) { const t = useT(); const c = CONTENT.s0; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null); const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0); const answerReady = isAudioReady(audio); const choose = (index) => { if (!answerReady) return; const nextAttempts = attempts + 1; setPicked(index); setAttempts(nextAttempts); audio.pushOneOff(t(HOOK_FEEDBACK)); onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: t(c.question), options: c.options.map((option) => t(option)), correctIndex: null, correctAnswer: null, studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: true, firstTry: storedAnswer?.firstTry ?? true, attempts: nextAttempts, wrongChoices: [] }); }; return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={picked !== null}><div className="stack hook-stack" data-g4-screen="hook"><Heading c={c} state="think" showBit/><section className="model-card hook-card" data-g4-role="hook-scene"><LessonVisual scene={c.scene} frame={audio.frame} screen={screen}/><RevealFrames frames={c.frames} frame={audio.frame}/></section><section className="question hook-question" data-g4-role="answer-card" aria-live="polite"><h2>{t(c.question)}</h2><div className="options">{c.options.map((option, index) => <button type="button" className={'option ' + (picked === index ? 'picked' : '')} disabled={!answerReady} onClick={() => choose(index)} key={index}><b>{String.fromCharCode(65 + index)}</b><span>{t(option)}</span></button>)}</div><div className="feedback-slot hook-feedback-slot">{picked !== null && <div className="feedback open neutral" data-g4-feedback="diagnostic"><b>◆</b><p>{t(HOOK_FEEDBACK)}</p></div>}</div></section></div></Stage>; }
function InfoScreen({ screen, onPrev, onNext }) { const c = CONTENT[`s${screen}`]; const [step, setStep] = useState(0); const audio = useGuidedNarration(c.audio, screen, step); const complete = step >= c.frames.length - 1; const audioReady = isAudioReady(audio); const advance = () => { if (complete || !audioReady) return; const nextStep = step + 1; setStep(nextStep); audio.speakStep(nextStep); }; const bitState = screen === 7 ? 'happy' : ['focus', 'point', 'idea'][(screen - 1) % 3]; return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={complete}><div className="stack info-stack"><Heading c={c} state={bitState} showBit/><section className="model-card guided-card"><LessonVisual scene={c.scene} frame={step} screen={screen}/><GuidedFramePanel frames={c.frames} step={step} onAdvance={advance} audioReady={audioReady}/></section></div></Stage>; }
function QuestionScreen({ screen, storedAnswer, onAnswer, onPrev, onNext }) { const t = useT(); const c = CONTENT[`s${screen}`]; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null); const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0); const [wrongChoices, setWrongChoices] = useState(storedAnswer?.wrongChoices ?? []); const openChoice = SCREEN_META[screen].type === 'strategy'; const revealed = picked !== null; const correct = openChoice ? revealed : picked === c.correctIndex; const canAnswer = isAudioReady(audio); const baseBitState = screen === 12 ? 'awkward' : screen === 13 ? 'point' : 'focus'; const bitState = revealed ? (correct ? 'nod' : 'awkward') : baseBitState; const choose = (index) => { if (!canAnswer || correct || wrongChoices.includes(index)) return; const ok = openChoice || index === c.correctIndex; const nextAttempts = attempts + 1; const nextWrongChoices = ok ? wrongChoices : [...wrongChoices, index]; setPicked(index); setAttempts(nextAttempts); setWrongChoices(nextWrongChoices); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(t(ok ? c.audio.on_correct : c.feedbackAudio[index])); onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: t(c.question), options: c.options.map((option) => t(option)), correctIndex: c.correctIndex, correctAnswer: t(c.options[c.correctIndex]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: ok, firstTry: storedAnswer?.firstTry === false ? false : nextAttempts === 1 && ok, attempts: nextAttempts, wrongChoices: nextWrongChoices }); }; const showProof = !openChoice && (correct || (!correct && wrongChoices.length >= 2)); return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={correct}><div className="stack question-stack"><Heading c={c} state={bitState} showBit/><section className="test-layout"><div className="test-model"><LessonVisual scene={c.scene} frame={audio.frame} screen={screen}/><RevealFrames frames={c.frames} frame={audio.frame}/></div><div className="question" aria-live="polite"><h2>{t(c.question)}</h2><div className="options">{c.options.map((option, index) => { const cls = openChoice && picked === index ? 'picked' : index === c.correctIndex && correct ? 'right' : wrongChoices.includes(index) ? 'bad' : ''; return <button type="button" className={'option ' + cls} disabled={!canAnswer || correct || wrongChoices.includes(index)} onClick={() => choose(index)} key={index}><b>{String.fromCharCode(65 + index)}</b><span>{t(option)}</span></button>; })}</div><div className="feedback-slot question-feedback-slot">{revealed && <div className="feedback-stack"><div className={'feedback open ' + (correct ? 'correct' : 'wrong')} data-g4-feedback={correct ? 'correct' : 'retry'}><BitSVG className="feedback-bit" state={correct ? "nod" : "awkward"}/><p>{t(correct ? c.audio.on_correct : c.audio.on_wrong[picked])}</p></div>{showProof && <div className="proof"><b className="proof-label">{t(SOLUTION_LABEL)}</b><span>{t(c.proof)}</span></div>}</div>}</div></div></section></div></Stage>; }
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
  const t = useT(); const c = CONTENT.s14; const storedAnswer = finalState; const [step, setStep] = useState(storedAnswer.step); const [reflection, setReflection] = useState(storedAnswer.reflection); const [titleClaimed, setTitleClaimed] = useState(storedAnswer?.titleClaimed === true); const [revealRequested, setRevealRequested] = useState(false); const audio = useGuidedNarration(c.audio, screen, step); const complete = step >= c.frames.length - 1; const audioReady = isAudioReady(audio); const titleState = titleClaimed ? 'claimed' : 'unclaimed'; const claimed = titleClaimed;
  const completeReveal = useCallback(() => { setRevealRequested(false); setTitleClaimed(true); onFinalState((previous) => ({ ...previous, titleClaimed: true })); }, [onFinalState]);
  const advance = () => { if (complete || !audioReady) return; const nextStep = step + 1; setStep(nextStep); onFinalState((previous) => ({ ...previous, step: nextStep })); audio.speakStep(nextStep); };
  const chooseReflection = (index) => { setReflection(index); onFinalState((previous) => ({ ...previous, reflection: index })); };
  const claimTitle = () => { if (reflection === null) return; if (!complete || !audioReady || titleClaimed || revealRequested) return; setRevealRequested(true); };
  const finish = () => { if (reflection === null || !titleClaimed) return; finishLesson(); };
return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={finish} canAdvance={complete && reflection !== null} canFinish={titleState === 'claimed'} finish><div className="stack summary-stack"><Heading c={c} state={claimed ? 'happy' : 'idea'} showBit/>{!complete ? <section className="model-card summary-card guided-card"><LessonVisual scene={c.scene} frame={step} screen={screen}/><GuidedFramePanel frames={c.frames} step={step} onAdvance={advance} audioReady={audioReady}/></section> : <div className="summary-complete"><section className="reflection-card final-reflection" data-g4-role="reflection" aria-live="polite"><h2>{t(REFLECTION.question)}</h2><div className="reflection-options">{REFLECTION.options.map((option, index) => <button type="button" className={'option ' + (reflection === index ? 'picked' : '')} disabled={!audioReady || revealRequested} onClick={() => chooseReflection(index)} key={index}><b>{String.fromCharCode(65 + index)}</b><span>{t(option)}</span></button>)}</div></section><G4TitleReveal active={revealRequested} title={c.rewardTitle} onComplete={completeReveal}/>{titleState !== 'claimed' ? <section className="title-claim-card"><span>★</span><h2>{t(c.rewardTitle)}</h2><button type="button" className="btn-white-accent g4-title-claim" disabled={reflection === null || revealRequested || !audioReady} onClick={claimTitle}>{t(bi('Unvonni olish', 'Получить звание', 'Claim title'))}</button></section> : null}{titleState === 'claimed' && <div data-g4-role="title-card"><G4TitleCard title={c.rewardTitle} answers={answers}/></div>}</div>}</div></Stage>;
}
const TOPIC_STYLES = `
.topic-visual{overflow:hidden;text-align:center}.topic-visual svg{width:min(100%,330px);height:175px;overflow:visible}.topic-visual strong{max-width:360px;color:${T.navy};font-size:12px;line-height:1.35}.topic-visual text{fill:${T.navy};font:900 14px 'JetBrains Mono',monospace}.tv-grid{fill:none;stroke:${T.ink3};stroke-width:2;opacity:.35}.tv-soft{fill:${T.cyanSoft};transition:.6s ease}.tv-outline,.tv-line{fill:none;stroke:${T.navy};stroke-width:4}.tv-path,.tv-ray,.tv-arc,.tv-accent,.tv-arrow,.tv-carry,.tv-cube-edge{fill:none;stroke:${T.cyan};stroke-width:7;stroke-linecap:round;stroke-linejoin:round}.tv-accent,.tv-carry{stroke:${T.accent};stroke-width:5}.tv-arrow{stroke-width:4;marker-end:none}.tv-path{stroke-dasharray:10 7;animation:topicDash 3s linear 2}.tv-pulse{fill:${T.accent};transform-box:fill-box;transform-origin:center;animation:topicPulse 1.7s ease-in-out 2}.tv-cable{fill:none;stroke:${T.cyan};stroke-width:18;stroke-linecap:round;transition:.55s}.tv-cable.b{stroke:${T.lime}}.tv-mass{fill:${T.cyan};opacity:.78;transition:.55s}.tv-card{fill:${T.paper};stroke:${T.ink3};stroke-width:3;transition:.4s}.tv-card.active{fill:${T.successSoft};stroke:${T.lime}}.tv-container{fill:rgba(22,143,163,.06);stroke:${T.navy};stroke-width:5}.tv-water{fill:rgba(22,143,163,.62);transition:.6s}.tv-cube-wire{fill:rgba(22,143,163,.08);stroke:${T.navy};stroke-width:4;stroke-linejoin:round}.tv-layer-wrap{width:208px;display:grid;grid-template-columns:repeat(6,1fr);gap:5px;transform:skewY(-5deg)}.tv-layer-wrap i{aspect-ratio:1;border-radius:6px;background:#DDE7E6;opacity:.14;transform:scale(.72);transition:.42s}.tv-layer-wrap i.active{opacity:1;transform:scale(1);background:linear-gradient(145deg,${T.cyan},${T.navy});box-shadow:3px 4px 0 rgba(23,59,82,.16)}.tv-protractor{fill:rgba(22,143,163,.09);stroke:${T.cyan};stroke-width:3}.tv-mark{fill:${T.accent};stroke:#fff;stroke-width:3}.tv-arc{stroke:${T.accent};stroke-width:4}.tv-scale{fill:none;stroke-width:18;stroke-linecap:round}.tv-scale.acute{stroke:${T.lime}}.tv-scale.obtuse{stroke:${T.accent}}.tv-shape{fill:rgba(22,143,163,.11);stroke:${T.navy};stroke-width:5;stroke-linejoin:round;transition:.55s}.tv-shape.accent{fill:rgba(149,201,61,.2);stroke:${T.lime}}.tv-right{fill:none;stroke:${T.accent};stroke-width:4}.tv-area{fill:rgba(22,143,163,.12)}.tv-cell{fill:rgba(149,201,61,.58);stroke:#fff;stroke-width:1;transition:opacity .4s}.tv-border{fill:none;stroke:${T.accent};stroke-width:7;stroke-dasharray:590;transition:stroke-dashoffset .55s}.tv-pool{fill:${T.cyan};stroke:#fff;stroke-width:3}.muted{opacity:.2}@keyframes topicDash{to{stroke-dashoffset:-34}}@keyframes topicPulse{50%{transform:scale(1.28);opacity:.62}}@media(max-width:639.98px){.topic-visual svg{height:145px}.topic-visual strong{font-size:11px}.tv-layer-wrap{width:165px}}@media(prefers-reduced-motion:reduce){.topic-visual *{animation:none!important;transition:none!important}.tv-border{stroke-dashoffset:0!important}}
`;
const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];
export default function Grade4Dars33({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) { const preview = previewMode ?? (langProp === undefined || langProp === null); const initialLang = normalizeLang(langProp); const [previewLang, setPreviewLang] = useState(initialLang); const lang = preview ? normalizeLang(previewLang) : initialLang; configureLesson({ ttsApiBase: ttsApiBase || '', voiceGender: voiceGender || 'f', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', previewMode: preview }); const [current, setCurrent] = useState(0); const [answers, setAnswers] = useState([]); const [finalState, setFinalState] = useState({ step: 0, reflection: null, titleClaimed: false }); const [startedAt] = useState(() => Date.now()); const finished = useRef(false); const recordAnswer = useCallback((answer) => setAnswers((previous) => { const next = [...previous]; const old = previous[answer.screenIdx]; next[answer.screenIdx] = { ...answer, firstTry: old ? old.firstTry : answer.firstTry }; return next; }), []); const finishLesson = useCallback(() => { if (finished.current) return; finished.current = true; const scored = SCREEN_META.map((meta, index) => meta.scored ? index : null).filter((index) => index !== null); const firstTryCorrect = scored.filter((index) => answers[index]?.firstTry === true).length; const payload = { lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle[lang], studentName: studentName || null, durationSec: Math.floor((Date.now() - startedAt) / 1000), totalQuestions: scored.length, correctAnswers: firstTryCorrect, scorePercent: Math.round(firstTryCorrect / scored.length * 100), finalScore: firstTryCorrect, finalTotal: scored.length, passed: firstTryCorrect / scored.length >= 0.6, firstTryStats: { total: scored.length, firstTryCorrect }, attemptsTotal: scored.reduce((sum, index) => sum + (answers[index]?.attempts ?? 0), 0), skillTags: LESSON_META.skillTags, answers: answers.filter(Boolean) }; if (onFinished) onFinished(payload); else console.log('[Grade4 Dars33 preview]', payload); }, [answers, lang, onFinished, startedAt, studentName]); const Current = SCREENS[current]; return <LangContext.Provider value={lang}><style>{STYLES + TOPIC_STYLES}</style><div className={'lesson-root ' + (preview ? 'lesson-root-preview' : '')}>{preview && <div className="preview-language" aria-label={bi("Ko'rish tili", 'Язык предпросмотра', 'Preview language')[lang]}>{['uz', 'ru', 'en'].map((code) => <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} finalState={finalState} onFinalState={setFinalState} onPrev={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))} finishLesson={finishLesson}/></div></LangContext.Provider>; }

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
.summary-complete>.title-claim-card{grid-column:auto}.summary-complete>[data-g4-role="title-card"]{height:100%;min-height:0}
@media(max-width:639.98px){.summary-complete{grid-template-rows:minmax(0,1fr) 88px}.summary-complete>.title-claim-card,.summary-complete>[data-g4-role="title-card"]{height:88px;min-height:0}.title-claim-card{padding:6px 7px;grid-template-columns:30px minmax(0,1fr) auto;place-items:center;align-content:center;gap:6px;text-align:left}.title-claim-card>span{font-size:28px}.title-claim-card h2{font-size:13px;line-height:1.1}.title-claim-card .g4-title-claim{min-width:96px;min-height:44px;padding:0 7px}}
@media(max-height:700px){.summary-complete{grid-template-rows:minmax(0,1fr) 82px}}
@media(max-width:639.98px) and (max-height:700px){.summary-complete>.title-claim-card,.summary-complete>[data-g4-role="title-card"]{height:82px}}
@media(prefers-reduced-motion:reduce){.lesson-root *{animation:none!important;transition:none!important}}
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
.stage-hook .hook-card{background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%)}
html:has(.lesson-root),body:has(.lesson-root),#root:has(.lesson-root),.lesson-page:has(.lesson-root),.lesson-frame:has(.lesson-root){width:100%;height:100%;min-height:0!important;margin:0;overflow:hidden!important;overscroll-behavior:none}.lesson-root,.lesson-root *{box-sizing:border-box}.lesson-root h1,.lesson-root h2,.lesson-root p{margin:0}.lesson-root button{font:inherit}.lesson-root{position:fixed;inset:0;width:100%;height:100dvh;min-height:0;overflow:hidden;color:${T.ink};background:radial-gradient(circle at 88% 9%,rgba(22,143,163,.11),transparent 25%),linear-gradient(145deg,#F7F8F4,#EEF3F1);font-family:'Manrope',system-ui,sans-serif}.stage{width:min(936px,100%);height:100dvh;margin:0 auto;display:grid;grid-template-rows:auto minmax(0,1fr) auto;overflow:hidden;background:rgba(245,245,240,.92);box-shadow:0 0 50px -34px rgba(${T.shadowBase},.45)}.stage-header{min-height:0;padding-top:9px;background:rgba(245,245,240,.96);backdrop-filter:blur(10px);z-index:5}.progress-track{height:7px;border-radius:999px;overflow:hidden;background:#DDE5E3}.progress-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,${T.cyan},${T.lime});transition:width .45s ease}.progress-bar{box-shadow:0 0 15px rgba(22,143,163,.34)}.stage-chrome{min-height:48px;display:flex;align-items:center;justify-content:space-between;gap:12px}.chrome-title,.chrome-actions{display:flex;align-items:center;gap:9px}.chrome-title{color:${T.navy};font-size:12px;font-weight:900}.status-dot{width:9px;height:9px;border-radius:50%;background:${T.accent};box-shadow:0 0 0 5px rgba(255,91,53,.1)}.screen-type,.screen-count{padding:5px 9px;border-radius:999px;color:${T.cyan};background:${T.cyanSoft};font-size:10px;font-weight:900}.screen-count{color:${T.ink2};background:#FFF}.audio-indicator{height:46px;padding:3px 6px;border-radius:13px;display:flex;align-items:center;gap:4px;background:#FFF;box-shadow:0 9px 20px -17px rgba(${T.shadowBase},.6)}.audio-indicator button{width:44px;height:44px;border:0;border-radius:9px;background:transparent;cursor:pointer}.audio-wave{height:20px;display:flex;align-items:center;gap:2px}.audio-wave i{width:3px;height:6px;border-radius:4px;background:${T.cyan};transition:.25s}.audio-wave.playing i:nth-child(1){height:12px}.audio-wave.playing i:nth-child(2){height:18px}.audio-wave.playing i:nth-child(3){height:9px}
.stage-content{min-height:0;padding-top:7px;padding-bottom:4px;display:grid;grid-template-rows:minmax(0,1fr) 40px;overflow:hidden}.stage-body{min-height:0;overflow:hidden}.caption-slot{height:40px;min-height:40px;padding-top:4px;overflow:hidden}.stage-nav{min-height:62px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(245,245,240,.95)}.btn-white-accent,.btn-ghost{min-width:128px;min-height:50px;padding:0 18px;border:0;border-radius:15px;cursor:pointer;font-weight:900}.btn-white-accent{color:${T.accent};background:#fff;box-shadow:0 12px 24px -17px rgba(255,91,53,.8)}.btn-white-accent:hover:not(:disabled){color:#fff;background:${T.accent}}.btn-ghost{color:${T.ink2};background:transparent}.btn-ghost:hover{background:#fff}.stack{height:100%;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr);gap:10px;overflow:hidden;animation:page-in .45s cubic-bezier(.16,1,.3,1) both}.heading{height:68px;min-height:0;display:flex;align-items:center;justify-content:space-between;gap:16px}.heading.heading-solo{justify-content:flex-start}.heading>div>span{color:${T.cyan};font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.heading h1{margin-top:4px!important;font:750 clamp(25px,4vw,38px)/1.06 'Source Serif 4',Georgia,serif}.heading .g1-char{width:62px;height:76px;flex:0 0 auto;filter:drop-shadow(0 9px 11px rgba(23,59,82,.2))}.model-card,.question,.test-model{min-height:0;padding:14px;overflow:hidden;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.model-card{height:100%;display:grid;grid-template-columns:minmax(250px,.85fr) minmax(300px,1.15fr);align-items:stretch;gap:14px}.hook-card{background:linear-gradient(135deg,${T.cyanSoft},#FFF)}.summary-card{background:linear-gradient(135deg,#FFF,${T.successSoft})}.reveal-grid{min-height:0;display:grid;align-content:center;gap:7px;overflow:hidden}.reveal-card{min-height:48px;padding:9px 12px;border-radius:14px;display:grid;grid-template-columns:30px 1fr;align-items:center;gap:9px;opacity:.12;transform:translateY(7px);background:#F8F8F4;transition:.38s ease}.reveal-card.show{opacity:1;transform:none}.reveal-card>b{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;color:#FFF;background:${T.cyan};font:900 10px 'JetBrains Mono',monospace}.reveal-card:last-child.show{background:${T.cyanSoft}}.question{height:100%;display:grid;grid-template-rows:auto auto minmax(92px,1fr);align-content:start;gap:9px}.question h2{font:720 clamp(17px,2.5vw,22px)/1.25 'Source Serif 4',Georgia,serif}.options{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.option{min-height:50px;padding:8px;border:0;border-radius:16px;display:grid;grid-template-columns:28px 1fr;align-items:center;gap:8px;color:${T.ink};background:#F8F8F4;text-align:left;cursor:pointer;transition:.25s}.option:hover:not(:disabled){transform:translateY(-2px)}.option>b{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;color:${T.cyan};background:${T.cyanSoft};font:900 11px 'JetBrains Mono',monospace}.option.picked{background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.27)}.option.right{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.25)}.option.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.25)}.feedback{padding:8px 10px;border-radius:13px;display:grid;grid-template-columns:25px 1fr;align-items:start;gap:7px;font-size:12px;line-height:1.22}.feedback.correct{background:${T.successSoft};box-shadow:inset 4px 0 ${T.success}}.feedback.wrong{background:${T.warnSoft};box-shadow:inset 4px 0 ${T.warn}}.feedback.neutral{background:${T.cyanSoft};box-shadow:inset 4px 0 ${T.cyan}}.proof{padding:7px 10px;border-radius:11px;overflow:hidden;color:#FFF;background:${T.navy};text-align:center;font:900 15px 'JetBrains Mono',monospace}.test-layout{height:100%;min-height:0;display:grid;grid-template-columns:.86fr 1.14fr;gap:10px;overflow:hidden}.test-model{display:grid;grid-template-rows:minmax(0,1fr) auto;align-content:stretch;gap:8px}.caption{height:36px;margin:0;padding:7px 11px;border-radius:12px;overflow:hidden;color:#fff;background:rgba(23,59,82,.94);font-size:11px;line-height:1.2;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2}.feedback-slot{min-height:0;overflow:hidden}.feedback-stack{height:100%;display:grid;align-content:start;gap:6px;overflow:hidden}.question-feedback-slot{min-height:92px}.hook-feedback-slot{min-height:58px}.guided-panel{min-height:0;display:grid;grid-template-rows:10px minmax(72px,1fr) 50px;gap:10px;overflow:hidden}.guided-progress{display:flex;align-items:center;gap:6px}.guided-progress i{height:6px;flex:1;border-radius:999px;background:#DDE5E3}.guided-progress i.active{background:${T.cyan}}.guided-frame{min-height:72px;padding:12px;border-radius:16px;display:grid;grid-template-columns:34px 1fr;align-items:center;gap:10px;overflow:hidden;background:#F8F8F4;font-weight:850}.guided-frame>b{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;color:#FFF;background:${T.cyan};font:900 12px 'JetBrains Mono',monospace}.guided-action{display:flex;align-items:center;justify-content:flex-end;min-height:50px}.step-button{min-width:150px}.guided-complete{padding:10px 12px;border-radius:12px;color:${T.success};background:${T.successSoft};font-size:12px;font-weight:900}.summary-complete{height:100%;min-height:0;display:grid;grid-template-columns:.9fr 1.1fr;gap:10px;overflow:hidden}.summary-complete .g4-title-card-stage{height:100%;min-height:0}.reflection-card{min-height:0;padding:14px;border-radius:20px;display:grid;grid-template-rows:auto minmax(0,1fr);gap:9px;overflow:hidden;background:#FFF;box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.reflection-card h2{font:720 18px/1.22 'Source Serif 4',Georgia,serif}.reflection-options{min-height:0;display:grid;grid-template-rows:repeat(3,minmax(44px,1fr));gap:7px;overflow:hidden}
.conversion-visual{min-height:210px;padding:14px;border-radius:20px;display:grid;place-items:center;gap:12px;background:linear-gradient(145deg,${T.cyanSoft},#FFF)}.relation-cards{width:100%;display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.relation-cards span{padding:12px 8px;border-radius:13px;opacity:.18;background:#FFF;text-align:center;font:900 12px 'JetBrains Mono',monospace;transition:.35s}.relation-cards span.active{opacity:1;color:#FFF;background:${T.cyan}}.console-screen{padding:13px 24px;border-radius:14px;color:#FFF;background:${T.navy};font:900 25px 'JetBrains Mono',monospace}.cross{position:absolute;color:${T.accent};font-size:84px;font-weight:900;opacity:0;transform:scale(.6) rotate(-15deg);transition:.4s}.cross.show{opacity:.85;transform:scale(1) rotate(-15deg)}.console{position:relative}.tape-line{width:260px;height:28px;padding:4px;border-radius:10px;background:#FFF}.tape-line i{height:100%;display:block;border-radius:7px;background:${T.cyan};transition:.5s}.tape strong{font:900 18px 'JetBrains Mono',monospace}.area-grid>div{width:150px;height:150px;padding:3px;display:grid;grid-template-columns:repeat(10,1fr);gap:2px;border:3px solid ${T.navy};border-radius:12px;background:#FFF}.area-grid i{border-radius:2px;background:#DDE7E6;transition:.35s}.area-grid i.active{background:${T.cyan}}.area-grid strong{font:900 14px 'JetBrains Mono',monospace}.algorithm{align-content:center}.algorithm span{width:min(380px,100%);padding:10px 14px;border-radius:12px;opacity:.16;background:#FFF;text-align:center;font:900 13px 'JetBrains Mono',monospace;transition:.35s}.algorithm span.active{opacity:1}.algorithm span:last-child.active{color:#FFF;background:${T.success}}.manifest{grid-template-columns:repeat(2,1fr)}.manifest span{padding:20px 12px;border-radius:15px;opacity:.2;background:#FFF;text-align:center;font-weight:900;transition:.35s}.manifest span.active{opacity:1;color:#FFF;background:${T.navy}}.direction>div{display:flex;align-items:center;gap:14px}.direction b{padding:15px;border-radius:13px;background:#FFF}.direction span{color:${T.accent};font-size:30px}.direction small{font-weight:900}.preview-language{position:fixed;top:9px;right:9px;z-index:30;display:flex;gap:3px;padding:3px;border-radius:999px;background:rgba(255,255,255,.94)}.preview-language button{min-width:44px;min-height:44px;padding:4px 9px;border:0;border-radius:999px;background:transparent;cursor:pointer;font-size:10px;font-weight:900}.preview-language .preview-active{color:#FFF;background:${T.accent}}button:focus-visible,input:focus-visible{outline:3px solid rgba(22,143,163,.48);outline-offset:3px}@keyframes page-in{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
@media(max-width:639.98px){.lesson-root-preview .stage-header{padding-top:52px}.screen-type{display:none}.stage{width:min(390px,100%)}.stage-header{padding-top:6px}.stage-chrome{min-height:46px}.chrome-title{max-width:92px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:9px}.chrome-actions{gap:4px}.screen-count{padding:4px 6px;font-size:9px}.audio-indicator{height:46px;padding:1px 3px}.audio-indicator button{width:44px;height:44px}.stage-content{grid-template-rows:minmax(0,1fr) 38px;padding-top:5px;padding-bottom:2px}.caption-slot{height:38px;min-height:38px;padding-top:3px}.caption{height:35px;padding:6px 9px;font-size:10px}.stage-nav{min-height:58px}.btn-white-accent,.btn-ghost{min-width:108px;min-height:48px;padding:0 10px;font-size:12px}.stack{gap:7px}.heading{height:56px;gap:8px}.heading h1{font-size:clamp(20px,6vw,24px)}.heading .g1-char{width:48px;height:60px}.model-card,.question,.test-model,.reflection-card{padding:8px;border-radius:15px}.model-card{grid-template-columns:minmax(126px,.86fr) minmax(156px,1.14fr);gap:7px}.hook-stack{grid-template-rows:auto minmax(0,.78fr) minmax(0,1.22fr)}.hook-question{grid-template-rows:auto auto minmax(52px,1fr)}.hook-question .options{grid-template-columns:repeat(3,minmax(0,1fr))}.hook-question .option{grid-template-columns:1fr;justify-items:center;align-content:center;text-align:center}.hook-question .option>b{display:none}.question h2{font-size:14px;line-height:1.16}.options{grid-template-columns:1fr;gap:5px}.option{min-height:44px;padding:5px 6px;border-radius:11px;grid-template-columns:24px 1fr;gap:5px;font-size:11px;line-height:1.15}.option>b{width:24px;height:24px}.feedback{padding:6px 7px;grid-template-columns:20px 1fr;gap:5px;font-size:10px}.proof{padding:5px 7px;font-size:9px}.test-layout{grid-template-columns:minmax(118px,.78fr) minmax(170px,1.22fr);gap:7px}.test-model{padding:6px}.test-model .reveal-grid{display:none}.question-feedback-slot{min-height:84px}.hook-feedback-slot{min-height:52px}.conversion-visual{height:100%;min-height:0;padding:6px;border-radius:13px;gap:6px}.guided-panel{grid-template-rows:8px minmax(58px,1fr) 46px;gap:7px}.guided-frame{min-height:58px;padding:8px;border-radius:13px;grid-template-columns:29px 1fr;gap:7px;font-size:11px}.guided-frame>b{width:29px;height:29px}.guided-action{min-height:46px}.step-button{min-width:124px}.guided-complete{padding:8px;font-size:10px}.summary-complete{grid-template-columns:1fr;grid-template-rows:88px minmax(0,1fr);gap:7px}.summary-complete .g4-title-card-stage{min-height:88px}.reflection-card h2{font-size:14px}.reflection-options{gap:5px}.preview-language{top:7px;left:50%;right:auto;transform:translateX(-50%)}}
@media(max-height:700px){.stage-header{padding-top:4px}.stage-chrome{min-height:44px}.stage-content{grid-template-rows:minmax(0,1fr) 34px}.caption-slot{height:34px;min-height:34px}.caption{height:31px;padding:5px 8px}.stage-nav{min-height:56px}.heading{height:52px}.heading .g1-char{width:44px;height:55px}.stack{gap:6px}.model-card,.question,.test-model,.reflection-card{padding:7px}.question-feedback-slot{min-height:78px}.hook-feedback-slot{min-height:48px}.guided-panel{grid-template-rows:7px minmax(52px,1fr) 44px;gap:5px}.guided-action{min-height:44px}.step-button{min-height:44px}.summary-complete{grid-template-rows:82px minmax(0,1fr)}}
@media(prefers-reduced-motion:reduce){.lesson-root *{animation:none!important;transition:none!important}}
`;
