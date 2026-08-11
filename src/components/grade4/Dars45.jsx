import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// 4-sinf · Dars 45 · Ikki obyektli harakat masalalari
// 15 ekran · 50 asosiy audio beat · barcha interaction ixtiyoriy, navigatsiya ochiq.
const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};
const FRAME_COUNTS = [3, 4, 4, 4, 4, 4, 4, 5, 2, 2, 2, 2, 2, 3, 5];
const TOTAL_SCREENS = FRAME_COUNTS.length;
const LESSON_META = { lessonId: "motion-4-45-v1", slug: "dars45-harakatga-doir-masalalar", lessonTitle: {"uz":"Harakatga doir masalalar","ru":"Задачи на движение","en":"Motion problems"}, skillTags: ["two-object-motion","relative-speed","meeting","catch-up","multi-step"] };
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
      "uz": "Lumo transport tarmog'i",
      "ru": "Транспортная сеть Лумо",
      "en": "Lumo transport network"
    },
    "title": {
      "uz": "Ikki transport qachon uchrashadi?",
      "ru": "Когда встретятся два транспорта?",
      "en": "When will the two vehicles meet?"
    },
    "scene": "route-meeting",
    "closedSet": true,
    "frames": [
      {
        "uz": "Masofa: 240 km",
        "ru": "Расстояние: 240 км",
        "en": "Distance: 240 km"
      },
      {
        "uz": "50 km/h va 70 km/h qarama-qarshi yo'naladi",
        "ru": "50 км/ч и 70 км/ч движутся навстречу",
        "en": "50 km/h and 70 km/h move towards each other"
      },
      {
        "uz": "Tezliklarni qo'shamizmi?",
        "ru": "Сложим скорости?",
        "en": "Should we add the speeds?"
      }
    ],
    "question": {
      "uz": "Uchrashuvgacha qancha vaqt o'tadi?",
      "ru": "Сколько времени пройдёт до встречи?",
      "en": "How long will it take them to meet?"
    },
    "options": [
      {
        "uz": "2 soat",
        "ru": "2 часа",
        "en": "2 hours"
      },
      {
        "uz": "3 soat",
        "ru": "3 часа",
        "en": "3 hours"
      },
      {
        "uz": "6 soat",
        "ru": "6 часов",
        "en": "6 hours"
      }
    ],
    "neutral": {
      "uz": "Taxmin saqlandi. Endi masofa har soatda qanday o'zgarishini ko'ramiz.",
      "ru": "Гипотеза сохранена. Проследим, как меняется расстояние каждый час.",
      "en": "Estimate saved. Now we will track how the gap changes each hour."
    },
    "audio": {
      "intro": {
        "uz": [
          "Masofa ikki yuz qirq kilometr",
          "ellik kilometr soatiga va yetmish kilometr soatiga qarama-qarshi yo'naladi",
          "Tezliklarni qo'shamizmi?"
        ],
        "ru": [
          "Расстояние двести сорок километров",
          "пятьдесят километров в час и семьдесят километров в час движутся навстречу",
          "Сложим скорости?"
        ],
        "en": [
          "Distance two hundred and forty kilometres",
          "fifty kilometres per hour and seventy kilometres per hour move towards each other",
          "Should we add the speeds?"
        ]
      }
    }
  },
  "s1": {
    "eyebrow": {
      "uz": "Tayanch bilim",
      "ru": "Опорное знание",
      "en": "Prior knowledge"
    },
    "title": {
      "uz": "S-v-t tayanchi",
      "ru": "Связь S–v–t",
      "en": "The S–v–t relationship"
    },
    "scene": "route-one",
    "frames": [
      {
        "uz": "S = v × t",
        "ru": "S = v × t",
        "en": "S = v × t"
      },
      {
        "uz": "v = S ÷ t",
        "ru": "v = S ÷ t",
        "en": "v = S ÷ t"
      },
      {
        "uz": "t = S ÷ v",
        "ru": "t = S ÷ v",
        "en": "t = S ÷ v"
      },
      {
        "uz": "Birliklar jadvalga tekislanadi",
        "ru": "Единицы выравниваются в таблице",
        "en": "Units are aligned in the table"
      }
    ],
    "audio": {
      "uz": [
        "S teng v karra t",
        "v teng S bo'lingan t",
        "t teng S bo'lingan v",
        "Birliklar jadvalga tekislanadi"
      ],
      "ru": [
        "S равно v умножить на t",
        "v равно S разделить на t",
        "t равно S разделить на v",
        "Единицы выравниваются в таблице"
      ],
      "en": [
        "S equals v times t",
        "v equals S divided by t",
        "t equals S divided by v",
        "Units are aligned in the table"
      ]
    }
  },
  "s2": {
    "eyebrow": {
      "uz": "Yaqinlashish modeli",
      "ru": "Модель сближения",
      "en": "Closing model"
    },
    "title": {
      "uz": "Masofa bir soatda",
      "ru": "Расстояние за один час",
      "en": "Distance in one hour"
    },
    "scene": "route-close",
    "frames": [
      {
        "uz": "Birinchi obyekt: 50 km",
        "ru": "Первый объект: 50 км",
        "en": "First object: 50 km"
      },
      {
        "uz": "Ikkinchi obyekt: 70 km",
        "ru": "Второй объект: 70 км",
        "en": "Second object: 70 km"
      },
      {
        "uz": "Bo'shliq ikkala tomondan qisqaradi",
        "ru": "Промежуток сокращается с обеих сторон",
        "en": "The gap closes from both sides"
      },
      {
        "uz": "50 + 70 = 120 km",
        "ru": "50 + 70 = 120 км",
        "en": "50 + 70 = 120 km"
      }
    ],
    "audio": {
      "uz": [
        "Birinchi obyekt ellik kilometr",
        "Ikkinchi obyekt yetmish kilometr",
        "Bo'shliq ikkala tomondan qisqaradi",
        "ellik qo'shuv yetmish teng bir yuz yigirma kilometr"
      ],
      "ru": [
        "Первый объект пятьдесят километров",
        "Второй объект семьдесят километров",
        "Промежуток сокращается с обеих сторон",
        "пятьдесят плюс семьдесят равно сто двадцать километров"
      ],
      "en": [
        "First object fifty kilometres",
        "Second object seventy kilometres",
        "The gap closes from both sides",
        "fifty plus seventy equals one hundred and twenty kilometres"
      ]
    }
  },
  "s3": {
    "eyebrow": {
      "uz": "Vaqt jadvali",
      "ru": "Таблица времени",
      "en": "Time table"
    },
    "title": {
      "uz": "Uchrashuv jadvali",
      "ru": "Таблица встречи",
      "en": "Meeting table"
    },
    "scene": "route-table",
    "frames": [
      {
        "uz": "0 soat: 240 km",
        "ru": "0 часов: 240 км",
        "en": "0 hours: 240 km"
      },
      {
        "uz": "1 soat: 120 km",
        "ru": "1 час: 120 км",
        "en": "1 hour: 120 km"
      },
      {
        "uz": "2 soat: 0 km",
        "ru": "2 часа: 0 км",
        "en": "2 hours: 0 km"
      },
      {
        "uz": "Uchrashuv: 2 soat",
        "ru": "Встреча: 2 часа",
        "en": "Meeting: 2 hours"
      }
    ],
    "audio": {
      "uz": [
        "nol soat ikki yuz qirq kilometr",
        "bir soat bir yuz yigirma kilometr",
        "ikki soat nol kilometr",
        "Uchrashuv ikki soat"
      ],
      "ru": [
        "ноль часов двести сорок километров",
        "один час сто двадцать километров",
        "два часа ноль километров",
        "Встреча два часа"
      ],
      "en": [
        "zero hours two hundred and forty kilometres",
        "one hour one hundred and twenty kilometres",
        "two hours zero kilometres",
        "Meeting two hours"
      ]
    }
  },
  "s4": {
    "eyebrow": {
      "uz": "Qoida",
      "ru": "Правило",
      "en": "Rule"
    },
    "title": {
      "uz": "Yaqinlashish tezligi",
      "ru": "Скорость сближения",
      "en": "Closing speed"
    },
    "scene": "route-rule",
    "frames": [
      {
        "uz": "v₁ + v₂",
        "ru": "v₁ + v₂",
        "en": "v₁ + v₂"
      },
      {
        "uz": "50 + 70 = 120 km/soat",
        "ru": "50 + 70 = 120 км/ч",
        "en": "50 + 70 = 120 km/h"
      },
      {
        "uz": "t = S ÷ (v₁ + v₂)",
        "ru": "t = S ÷ (v₁ + v₂)",
        "en": "t = S ÷ (v₁ + v₂)"
      },
      {
        "uz": "240 ÷ 120 = 2 soat",
        "ru": "240 ÷ 120 = 2 часа",
        "en": "240 ÷ 120 = 2 hours"
      }
    ],
    "audio": {
      "uz": [
        "birinchi tezlik qo'shuv ikkinchi tezlik",
        "ellik qo'shuv yetmish teng bir yuz yigirma kilometr soatiga",
        "Vaqtni topish uchun S masofani birinchi va ikkinchi tezliklar yig'indisiga bo'lamiz",
        "ikki yuz qirq bo'lingan bir yuz yigirma teng ikki soat"
      ],
      "ru": [
        "первая скорость плюс вторая скорость",
        "пятьдесят плюс семьдесят равно сто двадцать километров в час",
        "Чтобы найти время, расстояние S делим на сумму первой и второй скоростей",
        "двести сорок разделить на сто двадцать равно два часа"
      ],
      "en": [
        "first speed plus second speed",
        "fifty plus seventy equals one hundred and twenty kilometres per hour",
        "To find the time, divide distance S by the sum of the two speeds",
        "two hundred and forty divided by one hundred and twenty equals two hours"
      ]
    }
  },
  "s5": {
    "eyebrow": {
      "uz": "Boshqa yo'nalish",
      "ru": "Другое направление",
      "en": "Another direction"
    },
    "title": {
      "uz": "Ikki tomonga uzoqlashish",
      "ru": "Удаление в разные стороны",
      "en": "Moving apart"
    },
    "scene": "route-away",
    "frames": [
      {
        "uz": "Bitta nuqtadan ikki tomonga",
        "ru": "Из одной точки в разные стороны",
        "en": "From one point in opposite directions"
      },
      {
        "uz": "Birinchi tezlik: 35 km/soat",
        "ru": "Первая скорость: 35 км/ч",
        "en": "First speed: 35 km/h"
      },
      {
        "uz": "Ikkinchi tezlik: 45 km/soat",
        "ru": "Вторая скорость: 45 км/ч",
        "en": "Second speed: 45 km/h"
      },
      {
        "uz": "3 soatda: (35 + 45) × 3 = 240 km",
        "ru": "За 3 часа: (35 + 45) × 3 = 240 км",
        "en": "In 3 hours: (35 + 45) × 3 = 240 km"
      }
    ],
    "audio": {
      "uz": [
        "Bitta nuqtadan ikki tomonga",
        "Birinchi tezlik o'ttiz besh kilometr soatiga",
        "Ikkinchi tezlik qirq besh kilometr soatiga",
        "Avval o'ttiz besh bilan qirq beshni qo'shamiz, keyin yig'indini uchga ko'paytirib ikki yuz qirq kilometrni topamiz"
      ],
      "ru": [
        "Из одной точки в разные стороны",
        "Первая скорость тридцать пять километров в час",
        "Вторая скорость сорок пять километров в час",
        "Сначала складываем тридцать пять и сорок пять, затем умножаем сумму на три и получаем двести сорок километров"
      ],
      "en": [
        "From one point in opposite directions",
        "First speed thirty five kilometres per hour",
        "Second speed forty five kilometres per hour",
        "First add thirty five and forty five, then multiply the sum by three to get two hundred and forty kilometres"
      ]
    }
  },
  "s6": {
    "eyebrow": {
      "uz": "Quvib yetish",
      "ru": "Движение вдогонку",
      "en": "Catch-up motion"
    },
    "title": {
      "uz": "Quvib yetish",
      "ru": "Догоняющее движение",
      "en": "Catching up"
    },
    "scene": "route-catch",
    "frames": [
      {
        "uz": "Boshlang'ich oraliq: 60 km",
        "ru": "Начальный промежуток: 60 км",
        "en": "Starting gap: 60 km"
      },
      {
        "uz": "Tezliklar: 70 va 50 km/soat",
        "ru": "Скорости: 70 и 50 км/ч",
        "en": "Speeds: 70 and 50 km/h"
      },
      {
        "uz": "70 − 50 = 20 km/soat",
        "ru": "70 − 50 = 20 км/ч",
        "en": "70 − 50 = 20 km/h"
      },
      {
        "uz": "60 ÷ 20 = 3 soat",
        "ru": "60 ÷ 20 = 3 часа",
        "en": "60 ÷ 20 = 3 hours"
      }
    ],
    "audio": {
      "uz": [
        "Boshlang'ich oraliq oltmish kilometr",
        "Tezliklar yetmish va ellik kilometr soatiga",
        "yetmish ayiruv ellik teng yigirma kilometr soatiga",
        "oltmish bo'lingan yigirma teng uch soat"
      ],
      "ru": [
        "Начальный промежуток шестьдесят километров",
        "Скорости семьдесят и пятьдесят километров в час",
        "семьдесят минус пятьдесят равно двадцать километров в час",
        "шестьдесят разделить на двадцать равно три часа"
      ],
      "en": [
        "Starting gap sixty kilometres",
        "Speeds seventy and fifty kilometres per hour",
        "seventy minus fifty equals twenty kilometres per hour",
        "sixty divided by twenty equals three hours"
      ]
    }
  },
  "s7": {
    "eyebrow": {
      "uz": "Ko'p bosqichli masala",
      "ru": "Составная задача",
      "en": "Multi-step problem"
    },
    "title": {
      "uz": "Kechroq yo'lga chiqish",
      "ru": "Поздний старт",
      "en": "A delayed start"
    },
    "scene": "route-delay",
    "frames": [
      {
        "uz": "Sekin transport: 40 km/soat, 1 soat oldin",
        "ru": "Медленный транспорт: 40 км/ч, старт на 1 час раньше",
        "en": "Slower vehicle: 40 km/h, started 1 hour earlier"
      },
      {
        "uz": "Boshlang'ich oraliq: 40 km",
        "ru": "Начальный промежуток: 40 км",
        "en": "Starting gap: 40 km"
      },
      {
        "uz": "Tez transport: 60 km/soat",
        "ru": "Быстрый транспорт: 60 км/ч",
        "en": "Faster vehicle: 60 km/h"
      },
      {
        "uz": "60 − 40 = 20 km/soat",
        "ru": "60 − 40 = 20 км/ч",
        "en": "60 − 40 = 20 km/h"
      },
      {
        "uz": "40 ÷ 20 = 2 soat; kirish: 240 ÷ (50 + 70) = 2 soat",
        "ru": "40 ÷ 20 = 2 часа; вступление: 240 ÷ (50 + 70) = 2 часа",
        "en": "40 ÷ 20 = 2 hours; opening: 240 ÷ (50 + 70) = 2 hours"
      }
    ],
    "audio": {
      "uz": [
        "Sekin transport soatiga qirq kilometr tezlikda bir soat oldin yo'lga chiqdi",
        "Boshlang'ich oraliq qirq kilometr",
        "Tez transport oltmish kilometr soatiga",
        "oltmish ayiruv qirq teng yigirma kilometr soatiga",
        "Qirqni yigirmaga bo'lib ikki soatni topamiz. Kirishdagi masala ham yopildi: ikki yuz qirqni ellik va yetmish yig'indisiga bo'lsak, ikki soat chiqadi"
      ],
      "ru": [
        "Медленный транспорт ехал со скоростью сорок километров в час и выехал на час раньше",
        "Начальный промежуток сорок километров",
        "Быстрый транспорт шестьдесят километров в час",
        "шестьдесят минус сорок равно двадцать километров в час",
        "Сорок делим на двадцать и получаем два часа. Вводная задача тоже решена: двести сорок делим на сумму пятидесяти и семидесяти и получаем два часа"
      ],
      "en": [
        "The slower vehicle travelled at forty kilometres per hour and started one hour earlier",
        "Starting gap forty kilometres",
        "Faster vehicle sixty kilometres per hour",
        "sixty minus forty equals twenty kilometres per hour",
        "Forty divided by twenty gives two hours. For the opening problem, divide two hundred and forty by fifty plus seventy: two hours"
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
      "uz": "Uchrashuv vaqti",
      "ru": "Время встречи",
      "en": "Meeting time"
    },
    "scene": "route-test",
    "closedSet": true,
    "frames": [
      {
        "uz": "420 ÷ (60 + 45) = ?",
        "ru": "420 ÷ (60 + 45) = ?",
        "en": "420 ÷ (60 + 45) = ?"
      },
      {
        "uz": "Uchrashuv vaqtini toping",
        "ru": "Найдите время встречи",
        "en": "Find the meeting time"
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
        "uz": "7 soat",
        "ru": "7 часов",
        "en": "7 hours"
      },
      {
        "uz": "28 soat",
        "ru": "28 часов",
        "en": "28 hours"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "420 ÷ (60 + 45) = 4 soat",
      "ru": "420 ÷ (60 + 45) = 4 часа",
      "en": "420 ÷ (60 + 45) = 4 hours"
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Qarama-qarshi harakatda tezliklar qo'shilib, masofa yig'indi tezlikka bo'linadi.",
        "ru": "Верно. При встречном движении скорости складывают, а расстояние делят на суммарную скорость.",
        "en": "Correct. For motion towards each other, add the speeds and divide the distance by the combined speed."
      },
      {
        "uz": "Yana bir qarang: masofani tezliklardan faqat bittasiga bo'lish uchrashuv modelini to'liq ishlatmaydi.",
        "ru": "Посмотрите ещё раз: деление расстояния только на одну скорость не учитывает движение второго объекта.",
        "en": "Look again: dividing the distance by only one speed ignores the second moving object."
      },
      {
        "uz": "Yana bir qarang: yigirma sakkiz soat tezliklar ayirmasidan keladi. Uchrashuvda tezliklar qo'shiladi.",
        "ru": "Посмотрите ещё раз: двадцать восемь часов получается при использовании разности скоростей. При встречном движении скорости складывают.",
        "en": "Look again: twenty eight hours comes from using the speed difference. For meeting motion, add the speeds."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "To'rt yuz yigirmani oltmish va qirq besh yig'indisiga bo'lamiz",
          "Natija necha soat bo'lishini toping"
        ],
        "ru": [
          "Четыреста двадцать делим на сумму шестидесяти и сорока пяти",
          "Найдите, сколько часов получится"
        ],
        "en": [
          "Divide four hundred and twenty by the sum of sixty and forty five",
          "Find how many hours this gives"
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Qarama-qarshi harakatda tezliklar qo'shilib, masofa yig'indi tezlikka bo'linadi.",
        "ru": "Верно. При встречном движении скорости складывают, а расстояние делят на суммарную скорость.",
        "en": "Correct. For motion towards each other, add the speeds and divide the distance by the combined speed."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Qarama-qarshi harakatda tezliklar qo'shilib, masofa yig'indi tezlikka bo'linadi.",
          "ru": "Верно. При встречном движении скорости складывают, а расстояние делят на суммарную скорость.",
          "en": "Correct. For motion towards each other, add the speeds and divide the distance by the combined speed."
        },
        {
          "uz": "Yana bir qarang: masofani tezliklardan faqat bittasiga bo'lish uchrashuv modelini to'liq ishlatmaydi.",
          "ru": "Посмотрите ещё раз: деление расстояния только на одну скорость не учитывает движение второго объекта.",
          "en": "Look again: dividing the distance by only one speed ignores the second moving object."
        },
        {
          "uz": "Yana bir qarang: yigirma sakkiz soat tezliklar ayirmasidan keladi. Uchrashuvda tezliklar qo'shiladi.",
          "ru": "Посмотрите ещё раз: двадцать восемь часов получается при использовании разности скоростей. При встречном движении скорости складывают.",
          "en": "Look again: twenty eight hours comes from using the speed difference. For meeting motion, add the speeds."
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
      "uz": "Uzoqlashish masofasi",
      "ru": "Расстояние удаления",
      "en": "Distance apart"
    },
    "scene": "route-away-test",
    "closedSet": true,
    "frames": [
      {
        "uz": "(35 + 45) × 3 = ?",
        "ru": "(35 + 45) × 3 = ?",
        "en": "(35 + 45) × 3 = ?"
      },
      {
        "uz": "Uzoqlashish masofasini toping",
        "ru": "Найдите расстояние между объектами",
        "en": "Find the distance apart"
      }
    ],
    "question": {
      "uz": "3 soatdan keyin oraliq qancha?",
      "ru": "Каким будет расстояние через 3 часа?",
      "en": "What will the distance apart be after 3 hours?"
    },
    "options": [
      {
        "uz": "30 km",
        "ru": "30 км",
        "en": "30 km"
      },
      {
        "uz": "80 km",
        "ru": "80 км",
        "en": "80 km"
      },
      {
        "uz": "240 km",
        "ru": "240 км",
        "en": "240 km"
      }
    ],
    "correctIndex": 2,
    "proof": {
      "uz": "(35 + 45) × 3 = 240 km",
      "ru": "(35 + 45) × 3 = 240 км",
      "en": "(35 + 45) × 3 = 240 km"
    },
    "feedbackAudio": [
      {
        "uz": "Yana bir qarang: ayirma quvib yetishga mos; ikki tomonga uzoqlashishda tezliklar qo'shiladi.",
        "ru": "Посмотрите ещё раз: разность подходит для догоняющего движения; при удалении скорости складываются.",
        "en": "Look again: a difference fits catch-up motion; speeds are added when objects move apart."
      },
      {
        "uz": "Yana bir qarang: bu bir soatlik uzoqlashish; berilgan barcha vaqt uchun yana ko'paytirish kerak.",
        "ru": "Посмотрите ещё раз: это расстояние удаления за один час; его нужно умножить на всё данное время.",
        "en": "Look again: this is the distance gained in one hour; multiply it by the full time."
      },
      {
        "uz": "To'g'ri. Yig'indi tezlik berilgan vaqtga ko'paytirildi.",
        "ru": "Верно. Суммарная скорость умножена на данное время.",
        "en": "Correct. The combined speed was multiplied by the given time."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Avval o'ttiz besh bilan qirq beshni qo'shamiz, keyin yig'indini uchga ko'paytiramiz",
          "Uzoqlashish masofasini toping"
        ],
        "ru": [
          "Сначала складываем тридцать пять и сорок пять, затем умножаем сумму на три",
          "Найдите расстояние между объектами"
        ],
        "en": [
          "First add thirty five and forty five, then multiply the sum by three",
          "Find the distance apart"
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Yig'indi tezlik berilgan vaqtga ko'paytirildi.",
        "ru": "Верно. Суммарная скорость умножена на данное время.",
        "en": "Correct. The combined speed was multiplied by the given time."
      },
      "on_wrong": [
        {
          "uz": "Yana bir qarang: ayirma quvib yetishga mos; ikki tomonga uzoqlashishda tezliklar qo'shiladi.",
          "ru": "Посмотрите ещё раз: разность подходит для догоняющего движения; при удалении скорости складываются.",
          "en": "Look again: a difference fits catch-up motion; speeds are added when objects move apart."
        },
        {
          "uz": "Yana bir qarang: bu bir soatlik uzoqlashish; berilgan barcha vaqt uchun yana ko'paytirish kerak.",
          "ru": "Посмотрите ещё раз: это расстояние удаления за один час; его нужно умножить на всё данное время.",
          "en": "Look again: this is the distance gained in one hour; multiply it by the full time."
        },
        {
          "uz": "To'g'ri. Yig'indi tezlik berilgan vaqtga ko'paytirildi.",
          "ru": "Верно. Суммарная скорость умножена на данное время.",
          "en": "Correct. The combined speed was multiplied by the given time."
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
      "uz": "Quvib yetish vaqti",
      "ru": "Время догоняния",
      "en": "Catch-up time"
    },
    "scene": "route-catch-test",
    "closedSet": true,
    "frames": [
      {
        "uz": "60 ÷ (70 − 50) = ?",
        "ru": "60 ÷ (70 − 50) = ?",
        "en": "60 ÷ (70 − 50) = ?"
      },
      {
        "uz": "Quvib yetish vaqtini toping",
        "ru": "Найдите время догоняющего движения",
        "en": "Find the catch-up time"
      }
    ],
    "question": {
      "uz": "Tezroq transport necha soatda quvib yetadi?",
      "ru": "Через сколько часов быстрый транспорт догонит медленный?",
      "en": "How many hours will the faster vehicle take to catch up?"
    },
    "options": [
      {
        "uz": "3 soat",
        "ru": "3 часа",
        "en": "3 hours"
      },
      {
        "uz": "12 soat",
        "ru": "12 часов",
        "en": "12 hours"
      },
      {
        "uz": "60 soat",
        "ru": "60 часов",
        "en": "60 hours"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "60 ÷ (70 − 50) = 3 soat",
      "ru": "60 ÷ (70 − 50) = 3 часа",
      "en": "60 ÷ (70 − 50) = 3 hours"
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Boshlang'ich oraliq tezliklar ayirmasiga bo'lindi.",
        "ru": "Верно. Начальное расстояние разделено на разность скоростей.",
        "en": "Correct. The starting gap was divided by the speed difference."
      },
      {
        "uz": "Yana bir qarang: soatiga yigirma kilometr tezlikda o'n ikki soatda ikki yuz qirq kilometr yopiladi, oltmish emas. Vaqt uch soat.",
        "ru": "Посмотрите ещё раз: при скорости сближения двадцать километров в час за двенадцать часов закроется двести сорок километров, а не шестьдесят. Время равно трём часам.",
        "en": "Look again: at twenty kilometres per hour, twelve hours closes two hundred and forty kilometres, not sixty. The time is three hours."
      },
      {
        "uz": "Yana bir qarang: boshlang'ich oraliq vaqt emas; uni nisbiy tezlikka bo'lish kerak.",
        "ru": "Посмотрите ещё раз: начальное расстояние не является временем; его нужно разделить на относительную скорость.",
        "en": "Look again: the starting gap is not a time; divide it by the relative speed."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Avval yetmishdan ellikni ayiramiz, keyin oltmishni shu ayirmaga bo'lamiz",
          "Quvib yetish vaqtini toping"
        ],
        "ru": [
          "Сначала из семидесяти вычитаем пятьдесят, затем шестьдесят делим на эту разность",
          "Найдите время догоняющего движения"
        ],
        "en": [
          "First subtract fifty from seventy, then divide sixty by that difference",
          "Find the catch-up time"
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Boshlang'ich oraliq tezliklar ayirmasiga bo'lindi.",
        "ru": "Верно. Начальное расстояние разделено на разность скоростей.",
        "en": "Correct. The starting gap was divided by the speed difference."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Boshlang'ich oraliq tezliklar ayirmasiga bo'lindi.",
          "ru": "Верно. Начальное расстояние разделено на разность скоростей.",
          "en": "Correct. The starting gap was divided by the speed difference."
        },
        {
          "uz": "Yana bir qarang: soatiga yigirma kilometr tezlikda o'n ikki soatda ikki yuz qirq kilometr yopiladi, oltmish emas. Vaqt uch soat.",
          "ru": "Посмотрите ещё раз: при скорости сближения двадцать километров в час за двенадцать часов закроется двести сорок километров, а не шестьдесят. Время равно трём часам.",
          "en": "Look again: at twenty kilometres per hour, twelve hours closes two hundred and forty kilometres, not sixty. The time is three hours."
        },
        {
          "uz": "Yana bir qarang: boshlang'ich oraliq vaqt emas; uni nisbiy tezlikka bo'lish kerak.",
          "ru": "Посмотрите ещё раз: начальное расстояние не является временем; его нужно разделить на относительную скорость.",
          "en": "Look again: the starting gap is not a time; divide it by the relative speed."
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
      "uz": "Yig'indimi yoki ayirmami?",
      "ru": "Сумма или разность?",
      "en": "Sum or difference?"
    },
    "scene": "route-operation-test",
    "closedSet": true,
    "frames": [
      {
        "uz": "Obyektlar bir-biriga qarab harakatlanadi",
        "ru": "Объекты движутся навстречу",
        "en": "The objects move towards each other"
      },
      {
        "uz": "Qaysi amal nisbiy tezlikni beradi?",
        "ru": "Какое действие даёт относительную скорость?",
        "en": "Which operation gives the relative speed?"
      }
    ],
    "question": {
      "uz": "Yig'indimi yoki ayirmami?",
      "ru": "Сумма или разность?",
      "en": "Sum or difference?"
    },
    "options": [
      {
        "uz": "Yig'indi",
        "ru": "Сумма",
        "en": "Sum"
      },
      {
        "uz": "Ayirma",
        "ru": "Разность",
        "en": "Difference"
      },
      {
        "uz": "Ko'paytma",
        "ru": "Произведение",
        "en": "Product"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "Qarama-qarshi yo'nalishda tezliklar qo'shiladi",
      "ru": "При встречном движении скорости складываются",
      "en": "For motion towards each other, the speeds are added"
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Qarama-qarshi yo'nalishda ikkala obyekt oraliqni qisqartiradi, shuning uchun yig'indi olinadi.",
        "ru": "Верно. При встречном движении оба объекта сокращают расстояние, поэтому берут сумму.",
        "en": "Correct. Both objects close the gap, so their speeds are added."
      },
      {
        "uz": "Yana bir qarang: ayirma bir yo'nalishdagi quvib yetish holatiga mos.",
        "ru": "Посмотрите ещё раз: разность скоростей подходит для догоняющего движения в одном направлении.",
        "en": "Look again: a speed difference is used for catch-up motion in one direction."
      },
      {
        "uz": "Yana bir qarang: tezliklarni ko'paytirish nisbiy tezlikni bermaydi.",
        "ru": "Посмотрите ещё раз: умножение скоростей не даёт относительную скорость.",
        "en": "Look again: multiplying the speeds does not give relative speed."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Obyektlar bir-biriga qarab harakatlanadi",
          "Qaysi amal nisbiy tezlikni beradi?"
        ],
        "ru": [
          "Объекты движутся навстречу",
          "Какое действие даёт относительную скорость?"
        ],
        "en": [
          "The objects move towards each other",
          "Which operation gives the relative speed?"
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Qarama-qarshi yo'nalishda ikkala obyekt oraliqni qisqartiradi, shuning uchun yig'indi olinadi.",
        "ru": "Верно. При встречном движении оба объекта сокращают расстояние, поэтому берут сумму.",
        "en": "Correct. Both objects close the gap, so their speeds are added."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Qarama-qarshi yo'nalishda ikkala obyekt oraliqni qisqartiradi, shuning uchun yig'indi olinadi.",
          "ru": "Верно. При встречном движении оба объекта сокращают расстояние, поэтому берут сумму.",
          "en": "Correct. Both objects close the gap, so their speeds are added."
        },
        {
          "uz": "Yana bir qarang: ayirma bir yo'nalishdagi quvib yetish holatiga mos.",
          "ru": "Посмотрите ещё раз: разность скоростей подходит для догоняющего движения в одном направлении.",
          "en": "Look again: a speed difference is used for catch-up motion in one direction."
        },
        {
          "uz": "Yana bir qarang: tezliklarni ko'paytirish nisbiy tezlikni bermaydi.",
          "ru": "Посмотрите ещё раз: умножение скоростей не даёт относительную скорость.",
          "en": "Look again: multiplying the speeds does not give relative speed."
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
      "uz": "Bit ayirmani tanladi",
      "ru": "Бит выбрал разность",
      "en": "Bit chose the difference"
    },
    "scene": "route-error",
    "closedSet": true,
    "frames": [
      {
        "uz": "Bit: 70 − 50",
        "ru": "Бит: 70 − 50",
        "en": "Bit: 70 − 50"
      },
      {
        "uz": "Qarama-qarshi kelishda ikkala obyekt oraliqni qisqartiradi",
        "ru": "При встречном движении оба объекта сокращают промежуток",
        "en": "When moving towards each other, both objects close the gap"
      }
    ],
    "question": {
      "uz": "Bitning xatosini qaysi yozuv tuzatadi?",
      "ru": "Какая запись исправляет ошибку Бита?",
      "en": "Which expression corrects Bit's error?"
    },
    "options": [
      {
        "uz": "70 + 50",
        "ru": "70 + 50",
        "en": "70 + 50"
      },
      {
        "uz": "70 − 50",
        "ru": "70 − 50",
        "en": "70 − 50"
      },
      {
        "uz": "70 × 50",
        "ru": "70 × 50",
        "en": "70 × 50"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "Qarama-qarshi kelishda 70 + 50 tanlanadi",
      "ru": "При встречном движении выбирают 70 + 50",
      "en": "For motion towards each other, choose 70 + 50"
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Uchrashuvda tezliklar yig'indisi oraliqning har ikki tomondan qisqarishini ko'rsatadi.",
        "ru": "Верно. При встрече сумма скоростей показывает сокращение расстояния с двух сторон.",
        "en": "Correct. At a meeting, the speed sum represents the gap closing from both sides."
      },
      {
        "uz": "Yana bir qarang: ayirma aynan Bitning xatosini takrorlaydi; obyektlar bir-biriga qarab kelmoqda.",
        "ru": "Посмотрите ещё раз: разность повторяет ошибку Бита; объекты движутся навстречу.",
        "en": "Look again: the difference repeats Bit's mistake because the objects move towards each other."
      },
      {
        "uz": "Yana bir qarang: ko'paytma uchrashuvdagi nisbiy tezlikni ifodalamaydi.",
        "ru": "Посмотрите ещё раз: произведение не выражает относительную скорость при встрече.",
        "en": "Look again: a product does not represent relative speed for meeting motion."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Bit yetmish ayiruv ellik",
          "Qarama-qarshi kelishda ikkala obyekt oraliqni qisqartiradi"
        ],
        "ru": [
          "Бит семьдесят минус пятьдесят",
          "При встречном движении оба объекта сокращают промежуток"
        ],
        "en": [
          "Bit seventy minus fifty",
          "When moving towards each other both objects close the gap"
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Uchrashuvda tezliklar yig'indisi oraliqning har ikki tomondan qisqarishini ko'rsatadi.",
        "ru": "Верно. При встрече сумма скоростей показывает сокращение расстояния с двух сторон.",
        "en": "Correct. At a meeting, the speed sum represents the gap closing from both sides."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Uchrashuvda tezliklar yig'indisi oraliqning har ikki tomondan qisqarishini ko'rsatadi.",
          "ru": "Верно. При встрече сумма скоростей показывает сокращение расстояния с двух сторон.",
          "en": "Correct. At a meeting, the speed sum represents the gap closing from both sides."
        },
        {
          "uz": "Yana bir qarang: ayirma aynan Bitning xatosini takrorlaydi; obyektlar bir-biriga qarab kelmoqda.",
          "ru": "Посмотрите ещё раз: разность повторяет ошибку Бита; объекты движутся навстречу.",
          "en": "Look again: the difference repeats Bit's mistake because the objects move towards each other."
        },
        {
          "uz": "Yana bir qarang: ko'paytma uchrashuvdagi nisbiy tezlikni ifodalamaydi.",
          "ru": "Посмотрите ещё раз: произведение не выражает относительную скорость при встрече.",
          "en": "Look again: a product does not represent relative speed for meeting motion."
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
      "uz": "Kechikib chiqqan mashina",
      "ru": "Машина выехала позже",
      "en": "The car left later"
    },
    "scene": "route-case",
    "closedSet": true,
    "frames": [
      {
        "uz": "Avtobus: 40 km/soat, 1 soat oldin",
        "ru": "Автобус: 40 км/ч, выехал на 1 час раньше",
        "en": "Bus: 40 km/h, started 1 hour earlier"
      },
      {
        "uz": "Mashina: 60 km/soat",
        "ru": "Машина: 60 км/ч",
        "en": "Car: 60 km/h"
      },
      {
        "uz": "Boshlang'ich oraliq: 40 km",
        "ru": "Начальный промежуток: 40 км",
        "en": "Starting gap: 40 km"
      }
    ],
    "question": {
      "uz": "Mashina avtobusni necha soatda quvib yetadi?",
      "ru": "Через сколько часов машина догонит автобус?",
      "en": "How many hours will the car take to catch the bus?"
    },
    "options": [
      {
        "uz": "1 soat",
        "ru": "1 час",
        "en": "1 hour"
      },
      {
        "uz": "2 soat",
        "ru": "2 часа",
        "en": "2 hours"
      },
      {
        "uz": "4 soat",
        "ru": "4 часа",
        "en": "4 hours"
      }
    ],
    "correctIndex": 1,
    "proof": {
      "uz": "40 ÷ (60 − 40) = 2 soat",
      "ru": "40 ÷ (60 − 40) = 2 часа",
      "en": "40 ÷ (60 − 40) = 2 hours"
    },
    "feedbackAudio": [
      {
        "uz": "Yana bir qarang: oldin chiqqan avtobus boshlang'ich oraliq yaratganini hisobga oling.",
        "ru": "Посмотрите ещё раз: учтите начальный отрыв, созданный автобусом, который выехал раньше.",
        "en": "Look again: include the starting gap created by the bus leaving earlier."
      },
      {
        "uz": "To'g'ri. Boshlang'ich oraliq tezliklar ayirmasiga bo'lindi.",
        "ru": "Верно. Начальный отрыв разделён на разность скоростей.",
        "en": "Correct. The starting gap was divided by the speed difference."
      },
      {
        "uz": "Yana bir qarang: quvib yetish vaqtida oraliqni tezliklar ayirmasiga bo'lish kerak.",
        "ru": "Посмотрите ещё раз: время догоняния находят делением отрыва на разность скоростей.",
        "en": "Look again: catch-up time comes from dividing the gap by the speed difference."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Avtobus qirq kilometr soatiga bir soat oldin",
          "Mashina oltmish kilometr soatiga",
          "Boshlang'ich oraliq qirq kilometr"
        ],
        "ru": [
          "Автобус сорок километров в час выехал на один час раньше",
          "Машина шестьдесят километров в час",
          "Начальный промежуток сорок километров"
        ],
        "en": [
          "Bus forty kilometres per hour started one hour earlier",
          "Car sixty kilometres per hour",
          "Starting gap forty kilometres"
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Boshlang'ich oraliq tezliklar ayirmasiga bo'lindi.",
        "ru": "Верно. Начальный отрыв разделён на разность скоростей.",
        "en": "Correct. The starting gap was divided by the speed difference."
      },
      "on_wrong": [
        {
          "uz": "Yana bir qarang: oldin chiqqan avtobus boshlang'ich oraliq yaratganini hisobga oling.",
          "ru": "Посмотрите ещё раз: учтите начальный отрыв, созданный автобусом, который выехал раньше.",
          "en": "Look again: include the starting gap created by the bus leaving earlier."
        },
        {
          "uz": "To'g'ri. Boshlang'ich oraliq tezliklar ayirmasiga bo'lindi.",
          "ru": "Верно. Начальный отрыв разделён на разность скоростей.",
          "en": "Correct. The starting gap was divided by the speed difference."
        },
        {
          "uz": "Yana bir qarang: quvib yetish vaqtida oraliqni tezliklar ayirmasiga bo'lish kerak.",
          "ru": "Посмотрите ещё раз: время догоняния находят делением отрыва на разность скоростей.",
          "en": "Look again: catch-up time comes from dividing the gap by the speed difference."
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
      "uz": "Yo'nalishdan vaqtgacha",
      "ru": "От направления ко времени",
      "en": "From direction to time"
    },
    "scene": "route-final",
    "frames": [
      {
        "uz": "Yo'nalishni aniqlang",
        "ru": "Определите направление",
        "en": "Identify the direction"
      },
      {
        "uz": "Boshlang'ich oraliqni toping",
        "ru": "Найдите начальный промежуток",
        "en": "Find the starting gap"
      },
      {
        "uz": "Yig'indi yoki ayirmani tanlang",
        "ru": "Выберите сумму или разность",
        "en": "Choose a sum or difference"
      },
      {
        "uz": "Vaqtni toping",
        "ru": "Найдите время",
        "en": "Find the time"
      },
      {
        "uz": "Pozitsiyalar bilan tekshiring",
        "ru": "Проверьте по положениям объектов",
        "en": "Check using the objects' positions"
      }
    ],
    "audio": {
      "uz": [
        "Yo'nalishni aniqlang",
        "Boshlang'ich oraliqni toping",
        "Yig'indi yoki ayirmani tanlang",
        "Vaqtni toping",
        "Pozitsiyalar bilan tekshiring"
      ],
      "ru": [
        "Определите направление",
        "Найдите начальный промежуток",
        "Выберите сумму или разность",
        "Найдите время",
        "Проверьте по положениям объектов"
      ],
      "en": [
        "Identify the direction",
        "Find the starting gap",
        "Choose a sum or difference",
        "Find the time",
        "Check using the objects' positions"
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
function ConversionVisual({ c, frame, revealed = false }) {
  const t = useT();
  const kind = String(c.scene || 'review').split('-')[0];
  const items = (c.frames || []).map((item) => t(item));
  const shown = Math.min(items.length, frame + 1);
  if (kind === 'route') {
    const scene = String(c.scene || 'route-meeting');
    const leftEdge = 8;
    const rightEdge = 92;
    const span = rightEdge - leftEdge;
    const clamp = (value) => Math.max(0, Math.min(1, value));
    const meeting = (firstSpeed, secondSpeed, progress) => {
      const firstShare = firstSpeed / (firstSpeed + secondSpeed);
      const p = clamp(progress);
      return {
        first: leftEdge + span * firstShare * p,
        second: rightEdge - span * (1 - firstShare) * p,
      };
    };
    const movingApart = (firstSpeed, secondSpeed, progress) => {
      const start = leftEdge + span * firstSpeed / (firstSpeed + secondSpeed);
      const p = clamp(progress);
      return {
        first: start - (start - leftEdge) * p,
        second: start + (rightEdge - start) * p,
      };
    };
    const catching = (lead, fastSpeed, slowSpeed, progress) => {
      const catchTime = lead / (fastSpeed - slowSpeed);
      const fastDistance = fastSpeed * catchTime;
      const slowDistance = slowSpeed * catchTime;
      const scale = span / fastDistance;
      const p = clamp(progress);
      return {
        first: leftEdge + fastDistance * scale * p,
        second: leftEdge + lead * scale + slowDistance * scale * p,
      };
    };
    let dots = meeting(50, 70, Math.min(.5, frame * .25));
    let ratio = frame >= 1 ? '50 : 70' : 'S';
    let distance = '240 km';
    let singleObject = false;

    if (scene === 'route-one') {
      dots = { first: leftEdge + span * clamp(frame / 3), second: rightEdge };
      ratio = 'S = v × t';
      distance = '';
      singleObject = true;
    } else if (scene === 'route-close') {
      const leftProgress = .5;
      const rightProgress = frame >= 1 ? .5 : 0;
      const meetingPoint = leftEdge + span * 50 / 120;
      dots = {
        first: leftEdge + (meetingPoint - leftEdge) * leftProgress,
        second: rightEdge - (rightEdge - meetingPoint) * rightProgress,
      };
      ratio = frame >= 1 ? '50 : 70' : '50';
    } else if (scene === 'route-table') {
      dots = meeting(50, 70, Math.min(2, frame) / 2);
    } else if (scene === 'route-rule') {
      dots = meeting(50, 70, frame >= 3 ? 1 : frame * .25);
      ratio = frame >= 1 ? '50 : 70' : 'v₁ + v₂';
    } else if (scene === 'route-away' || scene === 'route-away-test') {
      const progress = scene === 'route-away-test' ? (revealed ? 1 : .45) : frame / 3;
      dots = movingApart(35, 45, progress);
      ratio = scene === 'route-away-test' || frame >= 2 ? '35 : 45' : frame >= 1 ? '35' : 'v₁ : v₂';
      distance = scene === 'route-away-test' || frame < 3
        ? t(bi('3 soat', '3 ч', '3 h'))
        : t(bi('3 soat · 240 km', '3 ч · 240 км', '3 h · 240 km'));
    } else if (scene === 'route-catch' || scene === 'route-catch-test') {
      const progress = scene === 'route-catch-test' ? (revealed ? 1 : .35) : frame / 3;
      dots = catching(60, 70, 50, progress);
      ratio = scene === 'route-catch-test' || frame >= 1 ? '70 : 50' : 'v₁ : v₂';
      distance = '60 km';
    } else if (scene === 'route-delay') {
      if (frame >= 4) {
        dots = meeting(50, 70, 1);
        ratio = t(bi('50 + 70 = 120 km/soat', '50 + 70 = 120 км/ч', '50 + 70 = 120 km/h'));
        distance = t(bi('240 ÷ 120 = 2 soat', '240 ÷ 120 = 2 ч', '240 ÷ 120 = 2 h'));
      } else {
        dots = catching(40, 60, 40, Math.max(0, frame - 1) / 3);
        ratio = frame >= 2 ? '60 : 40' : '40';
        distance = '40 km';
      }
    } else if (scene === 'route-test') {
      dots = meeting(60, 45, revealed ? 1 : Math.min(.45, (frame + 1) * .18));
      ratio = '60 : 45';
      distance = '420 km';
    } else if (scene === 'route-operation-test') {
      dots = meeting(70, 50, revealed ? .72 : .42);
      ratio = 'v₁ : v₂';
      distance = 'S';
    } else if (scene === 'route-error') {
      dots = meeting(70, 50, revealed ? 1 : .45);
      ratio = '70 : 50';
      distance = 'S';
    } else if (scene === 'route-case') {
      dots = catching(40, 60, 40, revealed ? 1 : Math.min(.48, (frame + 1) * .16));
      ratio = '60 : 40';
      distance = '40 km';
    } else if (scene === 'route-final') {
      dots = meeting(50, 70, frame / 4);
      ratio = 'v₁ : v₂';
      distance = 'S';
    }

    return <div className="conversion-visual" aria-label={t(c.title)}>
      <div style={{ width: '92%', height: 62, position: 'relative', display: 'grid', alignItems: 'center' }}>
        <div style={{ height: 8, borderRadius: 99, background: '#D7E5E4' }}/>
        <i style={{ position: 'absolute', left: `${dots.first}%`, width: 25, height: 25, borderRadius: '50%', background: T.cyan, boxShadow: '0 0 0 7px rgba(22,143,163,.12)', transform: 'translateX(-50%)', transition: 'left .8s ease' }}/>
        <i style={{ position: 'absolute', left: `${dots.second}%`, width: 25, height: 25, borderRadius: '50%', opacity: singleObject ? 0 : 1, background: T.accent, boxShadow: '0 0 0 7px rgba(255,91,53,.12)', transform: 'translateX(-50%)', transition: 'left .8s ease,opacity .35s ease' }}/>
        <b style={{ position: 'absolute', left: '50%', top: -3, transform: 'translateX(-50%)', color: T.navy, font: "900 11px 'JetBrains Mono',monospace" }}>{ratio}</b>
        {distance && <small style={{ position: 'absolute', left: '50%', bottom: -4, transform: 'translateX(-50%)', color: T.ink2, font: "900 10px 'JetBrains Mono',monospace" }}>{distance}</small>}
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
function Screen14({ screen, answers, onPrev, finishLesson }) {
  const c = CONTENT.s14; const audio = useNarration(c.audio, screen); const reduced = usePrefersReducedMotion(); const unlocked = audio.frame >= 4 || audio.completed || audio.muted || reduced;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={finishLesson} finish><div className="stack"><Heading c={c} state="happy" showBit/><section className="model-card summary-card"><ConversionVisual c={c} frame={audio.frame}/><RevealFrames frames={c.frames} frame={audio.frame}/></section><G4TitleReward unlocked={unlocked} title={{"uz":"Harakat strategiyasi ustasi","ru":"Мастер стратегий движения","en":"Motion strategy expert"}} answers={answers}/></div></Stage>;
}
const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];
export default function Grade4Dars45({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) { const preview = previewMode ?? (langProp === undefined || langProp === null); const initialLang = normalizeLang(langProp); const [previewLang, setPreviewLang] = useState(initialLang); const lang = preview ? normalizeLang(previewLang) : initialLang; configureLesson({ ttsApiBase: ttsApiBase || '', voiceGender: voiceGender || 'f', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', previewMode: preview }); const [current, setCurrent] = useState(0); const [answers, setAnswers] = useState([]); const [startedAt] = useState(() => Date.now()); const finished = useRef(false); const recordAnswer = useCallback((answer) => setAnswers((previous) => { const next = [...previous]; const old = previous[answer.screenIdx]; next[answer.screenIdx] = { ...answer, firstTry: old ? old.firstTry : answer.firstTry }; return next; }), []); const finishLesson = useCallback(() => { if (finished.current) return; finished.current = true; const scored = SCREEN_META.map((meta, index) => meta.scored ? index : null).filter((index) => index !== null); const firstTryCorrect = scored.filter((index) => answers[index]?.firstTry === true).length; const payload = { lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle[lang], studentName: studentName || null, durationSec: Math.floor((Date.now() - startedAt) / 1000), totalQuestions: scored.length, correctAnswers: firstTryCorrect, scorePercent: Math.round(firstTryCorrect / scored.length * 100), finalScore: firstTryCorrect, finalTotal: scored.length, passed: firstTryCorrect / scored.length >= 0.6, firstTryStats: { total: scored.length, firstTryCorrect }, attemptsTotal: scored.reduce((sum, index) => sum + (answers[index]?.attempts ?? 0), 0), skillTags: LESSON_META.skillTags, answers: answers.filter(Boolean) }; if (onFinished) onFinished(payload); else console.log('[Grade4 Dars45 preview]', payload); }, [answers, lang, onFinished, startedAt, studentName]); const Current = SCREENS[current]; return <LangContext.Provider value={lang}><style>{STYLES}</style><div className={'lesson-root ' + (preview ? 'lesson-root-preview' : '')}>{preview && <div className="preview-language" aria-label={bi("Ko'rish tili", 'Язык предпросмотра', 'Preview language')[lang]}>{['uz', 'ru', 'en'].map((code) => <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} onPrev={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))} finishLesson={finishLesson}/></div></LangContext.Provider>; }

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
