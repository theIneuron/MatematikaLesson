import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// 4-sinf · Dars 44 · Murakkab masalalar
// 15 ekran · audio bilan sinxron kadrlar · barcha interaction ixtiyoriy, navigatsiya ochiq.
const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};
const FRAME_COUNTS = [3, 4, 4, 4, 4, 4, 4, 5, 2, 2, 2, 2, 2, 3, 5];
const TOTAL_SCREENS = FRAME_COUNTS.length;
const LESSON_META = { lessonId: "compound-problems-4-44-v1", slug: "dars44-murakkab-masalalar", lessonTitle: {"uz":"Murakkab masalalar","ru":"Составные задачи","en":"Multi-step problems"}, skillTags: ["word-problems","multi-step","bar-model","operation-order"] };
const LESSON_REWARD_TITLE = {
  "uz": "Masala strategisti",
  "ru": "Стратег задач",
  "en": "Problem-solving strategist"
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
      "uz": "Qalamlar ombori",
      "ru": "Склад карандашей",
      "en": "Pencil store"
    },
    "title": {
      "uz": "Bitta savol, ikkita amal",
      "ru": "Один вопрос, два действия",
      "en": "One question, two operations"
    },
    "scene": "hook",
    "closedSet": true,
    "frames": [
      {
        "uz": "7 qutining har birida 18 tadan qalam bor.",
        "ru": "В каждой из 7 коробок по 18 карандашей.",
        "en": "Each of 7 boxes contains 18 pencils."
      },
      {
        "uz": "29 ta qalam tarqatildi. Nechta qalam qoldi?",
        "ru": "29 карандашей раздали. Сколько карандашей осталось?",
        "en": "29 pencils were handed out. How many pencils remain?"
      },
      {
        "uz": "Avval nimani bilishimiz kerak?",
        "ru": "Что нужно узнать сначала?",
        "en": "What must we find first?"
      }
    ],
    "question": {
      "uz": "Yakuniy savoldan oldin qaysi oraliq natija kerak?",
      "ru": "Какой промежуточный результат нужен перед итоговым вопросом?",
      "en": "Which intermediate result is needed before the final question?"
    },
    "options": [
      {
        "uz": "7 × 18",
        "ru": "7 × 18",
        "en": "7 × 18"
      },
      {
        "uz": "18 − 7",
        "ru": "18 − 7",
        "en": "18 − 7"
      },
      {
        "uz": "29 + 7",
        "ru": "29 + 7",
        "en": "29 + 7"
      }
    ],
    "neutral": {
      "uz": "Taxmin saqlandi. Yashirin oraliq savolni topamiz.",
      "ru": "Гипотеза сохранена. Найдём скрытый промежуточный вопрос.",
      "en": "Estimate saved. We will find the hidden intermediate question."
    },
    "audio": {
      "intro": {
        "uz": [
          "Yetti qutining har birida o'n sakkiz tadan qalam bor.",
          "Yigirma to'qqizta qalam tarqatildi. Nechta qalam qoldi?",
          "Avval nimani bilishimiz kerak?"
        ],
        "ru": [
          "В каждой из семи коробок по восемнадцать карандашей.",
          "Двадцать девять карандашей раздали. Сколько карандашей осталось?",
          "Что нужно узнать сначала?"
        ],
        "en": [
          "Each of seven boxes contains eighteen pencils.",
          "Twenty nine pencils were handed out. How many pencils remain?",
          "What must we find first?"
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
      "uz": "Sodda va murakkab",
      "ru": "Простая и составная",
      "en": "One-step and multi-step"
    },
    "scene": "simple-compound",
    "frames": [
      {
        "uz": "Bitta bog'lanish odatda bitta amal bilan yechiladi.",
        "ru": "Одну связь обычно раскрывают одним действием.",
        "en": "One relationship usually needs one operation."
      },
      {
        "uz": "Ikki bog'lanish odatda ikki amal talab qiladi.",
        "ru": "Две связи обычно требуют двух действий.",
        "en": "Two relationships usually need two operations."
      },
      {
        "uz": "Birinchi amal oraliq natijani beradi.",
        "ru": "Первое действие даёт промежуточный результат.",
        "en": "The first operation gives an intermediate result."
      },
      {
        "uz": "Keyingi amal yakuniy javobni beradi.",
        "ru": "Следующее действие даёт итоговый ответ.",
        "en": "The next operation gives the final answer."
      }
    ],
    "audio": {
      "uz": [
        "Bitta bog'lanish odatda bitta amal bilan yechiladi.",
        "Ikki bog'lanish odatda ikki amal talab qiladi.",
        "Birinchi amal oraliq natijani beradi.",
        "Keyingi amal yakuniy javobni beradi."
      ],
      "ru": [
        "Одну связь обычно раскрывают одним действием.",
        "Две связи обычно требуют двух действий.",
        "Первое действие даёт промежуточный результат.",
        "Следующее действие даёт итоговый ответ."
      ],
      "en": [
        "One relationship usually needs one operation.",
        "Two relationships usually need two operations.",
        "The first operation gives an intermediate result.",
        "The next operation gives the final answer."
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
      "uz": "Yashirin oraliq savol",
      "ru": "Скрытый промежуточный вопрос",
      "en": "Hidden intermediate question"
    },
    "scene": "hidden",
    "frames": [
      {
        "uz": "Avval masalaning yakuniy savolini toping.",
        "ru": "Сначала найдите итоговый вопрос задачи.",
        "en": "Find the final question first."
      },
      {
        "uz": "Savolga javob uchun qaysi miqdor yetishmayotganini aniqlang.",
        "ru": "Определите, какой величины не хватает для ответа.",
        "en": "Identify the missing quantity needed for the answer."
      },
      {
        "uz": "Masalan: avval jami nechta ekanini topish kerakmi?",
        "ru": "Например: нужно ли сначала узнать общее количество?",
        "en": "For example, must the total be found first?"
      },
      {
        "uz": "Oraliq savolni ifoda yoki sxemaga aylantiring.",
        "ru": "Превратите промежуточный вопрос в выражение или схему.",
        "en": "Turn the intermediate question into an expression or diagram."
      }
    ],
    "audio": {
      "uz": [
        "Avval masalaning yakuniy savolini toping.",
        "Savolga javob uchun qaysi miqdor yetishmayotganini aniqlang.",
        "Masalan: avval jami nechta ekanini topish kerakmi?",
        "Oraliq savolni ifoda yoki sxemaga aylantiring."
      ],
      "ru": [
        "Сначала найдите итоговый вопрос задачи.",
        "Определите, какой величины не хватает для ответа.",
        "Например: нужно ли сначала узнать общее количество?",
        "Превратите промежуточный вопрос в выражение или схему."
      ],
      "en": [
        "Find the final question first.",
        "Identify the missing quantity needed for the answer.",
        "For example, must the total be found first?",
        "Turn the intermediate question into an expression or diagram."
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
      "uz": "Qism–butun modeli",
      "ru": "Модель часть–целое",
      "en": "Part–whole model"
    },
    "scene": "bar",
    "frames": [
      {
        "uz": "Ma'lum qismlarni sxemada belgilang.",
        "ru": "Отметьте известные части на схеме.",
        "en": "Mark the known parts on the diagram."
      },
      {
        "uz": "Birinchi amal bilan oraliq butunni toping.",
        "ru": "Первым действием найдите промежуточное целое.",
        "en": "Use the first operation to find the intermediate whole."
      },
      {
        "uz": "Undan ishlatilgan qismini ajrating.",
        "ru": "Отделите от него использованную часть.",
        "en": "Remove the part that was used."
      },
      {
        "uz": "Qolgan qism yakuniy javob bo'ladi.",
        "ru": "Оставшаяся часть даст итоговый ответ.",
        "en": "The remaining part gives the final answer."
      }
    ],
    "audio": {
      "uz": [
        "Ma'lum qismlarni sxemada belgilang.",
        "Birinchi amal bilan oraliq butunni toping.",
        "Undan ishlatilgan qismini ajrating.",
        "Qolgan qism yakuniy javob bo'ladi."
      ],
      "ru": [
        "Отметьте известные части на схеме.",
        "Первым действием найдите промежуточное целое.",
        "Отделите от него использованную часть.",
        "Оставшаяся часть даст итоговый ответ."
      ],
      "en": [
        "Mark the known parts on the diagram.",
        "Use the first operation to find the intermediate whole.",
        "Remove the part that was used.",
        "The remaining part gives the final answer."
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
      "uz": "Ko'paytirish, so'ng ayirish",
      "ru": "Умножение, затем вычитание",
      "en": "Multiply, then subtract"
    },
    "scene": "multiply-subtract",
    "frames": [
      {
        "uz": "6 qutining har birida 24 tadan buyum bor.",
        "ru": "В каждой из 6 коробок по 24 предмета.",
        "en": "Each of 6 boxes contains 24 items."
      },
      {
        "uz": "6 × 24 = 144 buyum jami.",
        "ru": "6 × 24 = 144 предмета всего.",
        "en": "6 × 24 = 144 items altogether."
      },
      {
        "uz": "144 − 37 amalini bajaring.",
        "ru": "Вычислите 144 − 37.",
        "en": "Calculate 144 − 37."
      },
      {
        "uz": "107 ta buyum qoldi.",
        "ru": "Осталось 107 предметов.",
        "en": "107 items remain."
      }
    ],
    "audio": {
      "uz": [
        "Olti qutining har birida yigirma to'rt tadan buyum bor.",
        "Olti karra yigirma to'rt teng bir yuz qirq to'rt buyum jami.",
        "Bir yuz qirq to'rt ayirilgan o'ttiz yetti amalini bajaring.",
        "Bir yuz yettita buyum qoldi."
      ],
      "ru": [
        "В каждой из шести коробок по двадцать четыре предмета.",
        "Шесть умножить на двадцать четыре. Получаем сто сорок четыре предмета.",
        "Вычислите сто сорок четыре минус тридцать семь.",
        "Осталось сто семь предметов."
      ],
      "en": [
        "Each of six boxes contains twenty four items.",
        "Six multiplied by twenty four equals one hundred and forty four items altogether.",
        "Calculate one hundred and forty four minus thirty seven.",
        "One hundred and seven items remain."
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
      "uz": "Qo'shish, so'ng bo'lish",
      "ru": "Сложение, затем деление",
      "en": "Add, then divide"
    },
    "scene": "add-divide",
    "frames": [
      {
        "uz": "5 × 28 = 140.",
        "ru": "5 × 28 = 140.",
        "en": "5 × 28 = 140."
      },
      {
        "uz": "140 + 20 = 160.",
        "ru": "140 + 20 = 160.",
        "en": "140 + 20 = 160."
      },
      {
        "uz": "160 ÷ 8 amalini bajaring.",
        "ru": "Вычислите 160 ÷ 8.",
        "en": "Calculate 160 ÷ 8."
      },
      {
        "uz": "Har guruhda 20 tadan bo'ladi.",
        "ru": "В каждой группе будет по 20 предметов.",
        "en": "Each group will have 20 items."
      }
    ],
    "audio": {
      "uz": [
        "Besh karra yigirma sakkiz teng bir yuz qirq.",
        "Bir yuz qirq qo'shilgan yigirma teng bir yuz oltmish.",
        "Bir yuz oltmish bo'lingan sakkiz amalini bajaring.",
        "Har guruhda yigirma tadan bo'ladi."
      ],
      "ru": [
        "Пять умножить на двадцать восемь. Получаем сто сорок.",
        "К ста сорока прибавляем двадцать. Получаем сто шестьдесят.",
        "Вычислите сто шестьдесят разделить на восемь.",
        "В каждой группе будет по двадцать предметов."
      ],
      "en": [
        "Five multiplied by twenty eight equals one hundred and forty.",
        "One hundred and forty plus twenty equals one hundred and sixty.",
        "Calculate one hundred and sixty divided by eight.",
        "Each group will have twenty items."
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
      "uz": "Tekshiruv",
      "ru": "Проверка",
      "en": "Check"
    },
    "scene": "check",
    "frames": [
      {
        "uz": "Javob birligi savoldagi birlikka mosmi?",
        "ru": "Совпадает ли единица ответа с единицей в вопросе?",
        "en": "Does the answer's unit match the unit in the question?"
      },
      {
        "uz": "Javob taxmin qilingan oraliqdami?",
        "ru": "Находится ли ответ в ожидаемом диапазоне?",
        "en": "Is the answer within the estimated range?"
      },
      {
        "uz": "Teskari amal natijani tasdiqlaydimi?",
        "ru": "Подтверждает ли ответ обратное действие?",
        "en": "Does an inverse operation confirm the answer?"
      },
      {
        "uz": "Javob aynan so'ralgan savolga javob beradimi?",
        "ru": "Отвечает ли результат именно на вопрос задачи?",
        "en": "Does the result answer the exact question?"
      }
    ],
    "audio": {
      "uz": [
        "Javob birligi savoldagi birlikka mosmi?",
        "Javob taxmin qilingan oraliqdami?",
        "Teskari amal natijani tasdiqlaydimi?",
        "Javob aynan so'ralgan savolga javob beradimi?"
      ],
      "ru": [
        "Совпадает ли единица ответа с единицей в вопросе?",
        "Находится ли ответ в ожидаемом диапазоне?",
        "Подтверждает ли ответ обратное действие?",
        "Отвечает ли результат именно на вопрос задачи?"
      ],
      "en": [
        "Does the answer's unit match the unit in the question?",
        "Is the answer within the estimated range?",
        "Does an inverse operation confirm the answer?",
        "Does the result answer the exact question?"
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
      "uz": "Murakkab masala marshruti",
      "ru": "Маршрут составной задачи",
      "en": "Multi-step problem route"
    },
    "scene": "algorithm",
    "frames": [
      {
        "uz": "Yakuniy savolni tushuning.",
        "ru": "Поймите итоговый вопрос.",
        "en": "Understand the final question."
      },
      {
        "uz": "Ma'lum miqdorlarni ajrating.",
        "ru": "Выделите известные величины.",
        "en": "Identify the known quantities."
      },
      {
        "uz": "Oraliq savolni tuzing.",
        "ru": "Сформулируйте промежуточный вопрос.",
        "en": "Form the intermediate question."
      },
      {
        "uz": "Amallar tartibini belgilang.",
        "ru": "Определите порядок действий.",
        "en": "Set the order of operations."
      },
      {
        "uz": "Birinchi oraliq savol: 7 qutida jami nechta qalam?",
        "ru": "Первый промежуточный вопрос: сколько карандашей в 7 коробках?",
        "en": "First intermediate question: how many pencils are in 7 boxes?"
      }
    ],
    "audio": {
      "uz": [
        "Yakuniy savolni tushuning.",
        "Ma'lum miqdorlarni ajrating.",
        "Oraliq savolni tuzing.",
        "Amallar tartibini belgilang.",
        "Demak avval yetti qutida jami nechta qalam borligini topamiz; buning uchun yettini o'n sakkizga ko'paytiramiz."
      ],
      "ru": [
        "Поймите итоговый вопрос.",
        "Выделите известные величины.",
        "Сформулируйте промежуточный вопрос.",
        "Определите порядок действий.",
        "Итак, сначала узнаём, сколько всего карандашей в семи коробках; для этого семь умножаем на восемнадцать."
      ],
      "en": [
        "Understand the final question.",
        "Identify the known quantities.",
        "Form the intermediate question.",
        "Set the order of operations.",
        "Therefore, first find the total number of pencils in seven boxes by multiplying seven by eighteen."
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
      "uz": "Birinchi amal",
      "ru": "Первое действие",
      "en": "First operation"
    },
    "scene": "first-operation",
    "closedSet": true,
    "frames": [
      {
        "uz": "7 qutining har birida 18 tadan qalam bor.",
        "ru": "В каждой из 7 коробок по 18 карандашей.",
        "en": "Each of 7 boxes contains 18 pencils."
      },
      {
        "uz": "Guruhlar modeliga mos amalni tanlang.",
        "ru": "Выберите действие, соответствующее модели равных групп.",
        "en": "Choose the operation that matches the equal-groups model."
      }
    ],
    "question": {
      "uz": "Birinchi amal qaysi?",
      "ru": "Какое действие выполняется первым?",
      "en": "Which operation is performed first?"
    },
    "options": [
      {
        "uz": "7 + 18",
        "ru": "7 + 18",
        "en": "7 + 18"
      },
      {
        "uz": "7 × 18",
        "ru": "7 × 18",
        "en": "7 × 18"
      },
      {
        "uz": "18 − 7",
        "ru": "18 − 7",
        "en": "18 − 7"
      }
    ],
    "correctIndex": 1,
    "proof": {
      "uz": "7 ta teng guruhning har birida 18 tadan qalam bo'lsa, jami son 7 × 18 bilan topiladi.",
      "ru": "Если в каждой из 7 равных групп по 18 карандашей, общее число находят как 7 × 18.",
      "en": "With 18 pencils in each of 7 equal groups, the total is found by 7 × 18."
    },
    "audio": {
      "intro": {
        "uz": [
          "Yetti qutining har birida o'n sakkiztadan qalam bor.",
          "Guruhlar modeliga mos amalni tanlang."
        ],
        "ru": [
          "В каждой из семи коробок по восемнадцать карандашей.",
          "Выберите действие, соответствующее модели равных групп."
        ],
        "en": [
          "Each of seven boxes contains eighteen pencils.",
          "Choose the operation that matches the equal-groups model."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Yettita teng guruhning har birida o'n sakkiztadan qalam bo'lsa, jami son yetti karra o'n sakkiz bilan topiladi.",
        "ru": "Верно. Если в каждой из семи равных групп по восемнадцать карандашей, общее число находят как семь умножить на восемнадцать.",
        "en": "Correct. With eighteen pencils in each of seven equal groups, the total is found by seven multiplied by eighteen."
      },
      "on_wrong": [
        {
          "uz": "Yana bir qarang: Yetti qo'shilgan o'n sakkiz faqat ikki sonni bir martadan oladi. Bu yerda o'n sakkiz qalamdan yettita teng guruh bor, shuning uchun ko'paytiring.",
          "ru": "Посмотрите ещё раз: Семь плюс восемнадцать берёт каждое число только один раз. Здесь семь равных групп по восемнадцать карандашей, поэтому нужно умножение.",
          "en": "Look again: Seven plus eighteen uses each number once. Here there are seven equal groups of eighteen pencils, so multiplication is needed."
        },
        {
          "uz": "To'g'ri. Yettita teng guruhning har birida o'n sakkiztadan qalam bo'lsa, jami son yetti karra o'n sakkiz bilan topiladi.",
          "ru": "Верно. Если в каждой из семи равных групп по восемнадцать карандашей, общее число находят как семь умножить на восемнадцать.",
          "en": "Correct. With eighteen pencils in each of seven equal groups, the total is found by seven multiplied by eighteen."
        },
        {
          "uz": "Yana bir qarang: O'n sakkizdan yettini ayirish guruhlar sonini qalamlar sonidan olib tashlaydi. Jami qalam uchun yetti guruhni o'n sakkiztadan oling.",
          "ru": "Посмотрите ещё раз: Вычитание семи из восемнадцати смешивает число групп с числом карандашей в группе. Для общего количества умножьте семь на восемнадцать.",
          "en": "Look again: Subtracting seven from eighteen mixes the group count with pencils per group. Find the total by multiplying seven by eighteen."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "Yana bir qarang: Yetti qo'shilgan o'n sakkiz faqat ikki sonni bir martadan oladi. Bu yerda o'n sakkiz qalamdan yettita teng guruh bor, shuning uchun ko'paytiring.",
        "ru": "Посмотрите ещё раз: Семь плюс восемнадцать берёт каждое число только один раз. Здесь семь равных групп по восемнадцать карандашей, поэтому нужно умножение.",
        "en": "Look again: Seven plus eighteen uses each number once. Here there are seven equal groups of eighteen pencils, so multiplication is needed."
      },
      {
        "uz": "To'g'ri. Yettita teng guruhning har birida o'n sakkiztadan qalam bo'lsa, jami son yetti karra o'n sakkiz bilan topiladi.",
        "ru": "Верно. Если в каждой из семи равных групп по восемнадцать карандашей, общее число находят как семь умножить на восемнадцать.",
        "en": "Correct. With eighteen pencils in each of seven equal groups, the total is found by seven multiplied by eighteen."
      },
      {
        "uz": "Yana bir qarang: O'n sakkizdan yettini ayirish guruhlar sonini qalamlar sonidan olib tashlaydi. Jami qalam uchun yetti guruhni o'n sakkiztadan oling.",
        "ru": "Посмотрите ещё раз: Вычитание семи из восемнадцати смешивает число групп с числом карандашей в группе. Для общего количества умножьте семь на восемнадцать.",
        "en": "Look again: Subtracting seven from eighteen mixes the group count with pencils per group. Find the total by multiplying seven by eighteen."
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
      "uz": "Mos ifoda",
      "ru": "Подходящее выражение",
      "en": "Matching expression"
    },
    "scene": "expression-choice",
    "closedSet": true,
    "frames": [
      {
        "uz": "320 ta kitobga 4 qutida 45 tadan kitob qo'shildi.",
        "ru": "К 320 книгам добавили 4 коробки по 45 книг.",
        "en": "4 boxes of 45 books were added to 320 books."
      },
      {
        "uz": "Keyin 96 ta kitob berildi.",
        "ru": "Затем выдали 96 книг.",
        "en": "Then 96 books were lent out."
      }
    ],
    "question": {
      "uz": "Masalaga mos ifodani tanlang.",
      "ru": "Выберите выражение для задачи.",
      "en": "Choose the expression that matches the problem."
    },
    "options": [
      {
        "uz": "320 + 4 × 45 − 96",
        "ru": "320 + 4 × 45 − 96",
        "en": "320 + 4 × 45 − 96"
      },
      {
        "uz": "(320 + 4) × 45 − 96",
        "ru": "(320 + 4) × 45 − 96",
        "en": "(320 + 4) × 45 − 96"
      },
      {
        "uz": "320 + 4 × (45 − 96)",
        "ru": "320 + 4 × (45 − 96)",
        "en": "320 + 4 × (45 − 96)"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "320 + 4 × 45 − 96 = 404 ifoda masaladagi uchta bog'lanishni saqlaydi.",
      "ru": "Выражение 320 + 4 × 45 − 96 = 404 сохраняет все три связи задачи.",
      "en": "The expression 320 + 4 × 45 − 96 = 404 keeps all three relationships in the problem."
    },
    "audio": {
      "intro": {
        "uz": [
          "Uch yuz yigirmata kitobga to'rt qutida qirq beshtadan kitob qo'shildi.",
          "Keyin to'qson oltita kitob berildi."
        ],
        "ru": [
          "К трёмстам двадцати книгам добавили четыре коробки по сорок пять книг.",
          "Затем выдали девяносто шесть книг."
        ],
        "en": [
          "Four boxes of forty five books were added to three hundred and twenty books.",
          "Then ninety six books were lent out."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. To'rt karra qirq besh bir yuz sakson. Unga uch yuz yigirmani qo'shib, to'qson oltini ayirsak, to'rt yuz to'rt chiqadi.",
        "ru": "Верно. Четыре умножить на сорок пять равно сто восемьдесят. Прибавляем триста двадцать, вычитаем девяносто шесть и получаем четыреста четыре.",
        "en": "Correct. Four multiplied by forty five is one hundred and eighty. Add three hundred and twenty, then subtract ninety six to get four hundred and four."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. To'rt karra qirq besh bir yuz sakson. Unga uch yuz yigirmani qo'shib, to'qson oltini ayirsak, to'rt yuz to'rt chiqadi.",
          "ru": "Верно. Четыре умножить на сорок пять равно сто восемьдесят. Прибавляем триста двадцать, вычитаем девяносто шесть и получаем четыреста четыре.",
          "en": "Correct. Four multiplied by forty five is one hundred and eighty. Add three hundred and twenty, then subtract ninety six to get four hundred and four."
        },
        {
          "uz": "Yana bir qarang: Bu qavs uch yuz yigirma bilan guruhlar soni to'rtni qo'shib, ikkalasini qirq beshga ko'paytiradi. Faqat to'rtta guruh qirq beshtadan.",
          "ru": "Посмотрите ещё раз: Эти скобки складывают триста двадцать с числом групп четыре и умножают всю сумму на сорок пять. По сорок пять есть только в четырёх группах.",
          "en": "Look again: These brackets add three hundred and twenty to the four groups, then multiply the whole sum by forty-five. Only four groups contain forty-five each."
        },
        {
          "uz": "Yana bir qarang: Bu qavs to'qson oltini bitta guruhdagi qirq beshdan ayiradi. Aslida avval to'rtta guruhning jami topiladi, so'ng to'qson olti ayiriladi.",
          "ru": "Посмотрите ещё раз: Эти скобки вычитают девяносто шесть из сорока пяти предметов одной группы. Сначала найдите сумму четырёх групп, затем вычтите девяносто шесть.",
          "en": "Look again: These brackets subtract ninety-six from one group of forty-five. First total the four groups, then subtract ninety-six."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. To'rt karra qirq besh bir yuz sakson. Unga uch yuz yigirmani qo'shib, to'qson oltini ayirsak, to'rt yuz to'rt chiqadi.",
        "ru": "Верно. Четыре умножить на сорок пять равно сто восемьдесят. Прибавляем триста двадцать, вычитаем девяносто шесть и получаем четыреста четыре.",
        "en": "Correct. Four multiplied by forty five is one hundred and eighty. Add three hundred and twenty, then subtract ninety six to get four hundred and four."
      },
      {
        "uz": "Yana bir qarang: Bu qavs uch yuz yigirma bilan guruhlar soni to'rtni qo'shib, ikkalasini qirq beshga ko'paytiradi. Faqat to'rtta guruh qirq beshtadan.",
        "ru": "Посмотрите ещё раз: Эти скобки складывают триста двадцать с числом групп четыре и умножают всю сумму на сорок пять. По сорок пять есть только в четырёх группах.",
        "en": "Look again: These brackets add three hundred and twenty to the four groups, then multiply the whole sum by forty-five. Only four groups contain forty-five each."
      },
      {
        "uz": "Yana bir qarang: Bu qavs to'qson oltini bitta guruhdagi qirq beshdan ayiradi. Aslida avval to'rtta guruhning jami topiladi, so'ng to'qson olti ayiriladi.",
        "ru": "Посмотрите ещё раз: Эти скобки вычитают девяносто шесть из сорока пяти предметов одной группы. Сначала найдите сумму четырёх групп, затем вычтите девяносто шесть.",
        "en": "Look again: These brackets subtract ninety-six from one group of forty-five. First total the four groups, then subtract ninety-six."
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
      "uz": "Qutilar va sarflangan buyumlar",
      "ru": "Коробки и использованные предметы",
      "en": "Boxes and used items"
    },
    "scene": "remaining",
    "closedSet": true,
    "frames": [
      {
        "uz": "6 qutining har birida 24 tadan buyum bor.",
        "ru": "В каждой из 6 коробок по 24 предмета.",
        "en": "Each of 6 boxes contains 24 items."
      },
      {
        "uz": "37 ta buyum sarflandi.",
        "ru": "37 предметов использовали.",
        "en": "37 items were used."
      }
    ],
    "question": {
      "uz": "Nechta buyum qoldi?",
      "ru": "Сколько предметов осталось?",
      "en": "How many items remain?"
    },
    "options": [
      {
        "uz": "107",
        "ru": "107",
        "en": "107"
      },
      {
        "uz": "121",
        "ru": "121",
        "en": "121"
      },
      {
        "uz": "181",
        "ru": "181",
        "en": "181"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "6 × 24 − 37 = 107, demak 107 ta buyum qoladi.",
      "ru": "6 × 24 − 37 = 107, значит, остаётся 107 предметов.",
      "en": "6 × 24 − 37 = 107, so 107 items remain."
    },
    "audio": {
      "intro": {
        "uz": [
          "Olti qutining har birida yigirma to'rt tadan buyum bor.",
          "O'ttiz yettita buyum sarflandi."
        ],
        "ru": [
          "В каждой из шести коробок по двадцать четыре предмета.",
          "Тридцать семь предметов использовали."
        ],
        "en": [
          "Each of six boxes contains twenty four items.",
          "Thirty seven items were used."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Olti karra yigirma to'rt ayirilgan o'ttiz yetti teng bir yuz yetti, demak bir yuz yettita buyum qoladi.",
        "ru": "Верно. Шесть умножить на двадцать четыре минус тридцать семь равно сто семь, значит, остаётся сто семь предметов.",
        "en": "Correct. Six multiplied by twenty four minus thirty seven equals one hundred and seven, so one hundred and seven items remain."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Olti karra yigirma to'rt ayirilgan o'ttiz yetti teng bir yuz yetti, demak bir yuz yettita buyum qoladi.",
          "ru": "Верно. Шесть умножить на двадцать четыре минус тридцать семь равно сто семь, значит, остаётся сто семь предметов.",
          "en": "Correct. Six multiplied by twenty four minus thirty seven equals one hundred and seven, so one hundred and seven items remain."
        },
        {
          "uz": "Yana bir qarang: Agar bir yuz yigirma bir buyum qolsa, bir yuz qirq to'rtdan faqat yigirma uchta sarflangan bo'lardi. Masalada o'ttiz yettita sarflangan.",
          "ru": "Посмотрите ещё раз: Если осталось сто двадцать один, из ста сорока четырёх использовали только двадцать три. По условию использовали тридцать семь.",
          "en": "Look again: If one hundred and twenty-one remained, only twenty-three of one hundred and forty-four were used. The problem says thirty-seven were used."
        },
        {
          "uz": "Yana bir qarang: Bir yuz sakson bir sarflangan o'ttiz yettini jami bir yuz qirq to'rtga qo'shishdan chiqadi. Sarflangan miqdorni ayirish kerak.",
          "ru": "Посмотрите ещё раз: Сто восемьдесят один получается при сложении использованных тридцати семи с общим количеством сто сорок четыре. Использованное нужно вычесть.",
          "en": "Look again: One hundred and eighty-one comes from adding the thirty-seven used items to the total of one hundred and forty-four. Used items must be subtracted."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Olti karra yigirma to'rt ayirilgan o'ttiz yetti teng bir yuz yetti, demak bir yuz yettita buyum qoladi.",
        "ru": "Верно. Шесть умножить на двадцать четыре минус тридцать семь равно сто семь, значит, остаётся сто семь предметов.",
        "en": "Correct. Six multiplied by twenty four minus thirty seven equals one hundred and seven, so one hundred and seven items remain."
      },
      {
        "uz": "Yana bir qarang: Agar bir yuz yigirma bir buyum qolsa, bir yuz qirq to'rtdan faqat yigirma uchta sarflangan bo'lardi. Masalada o'ttiz yettita sarflangan.",
        "ru": "Посмотрите ещё раз: Если осталось сто двадцать один, из ста сорока четырёх использовали только двадцать три. По условию использовали тридцать семь.",
        "en": "Look again: If one hundred and twenty-one remained, only twenty-three of one hundred and forty-four were used. The problem says thirty-seven were used."
      },
      {
        "uz": "Yana bir qarang: Bir yuz sakson bir sarflangan o'ttiz yettini jami bir yuz qirq to'rtga qo'shishdan chiqadi. Sarflangan miqdorni ayirish kerak.",
        "ru": "Посмотрите ещё раз: Сто восемьдесят один получается при сложении использованных тридцати семи с общим количеством сто сорок четыре. Использованное нужно вычесть.",
        "en": "Look again: One hundred and eighty-one comes from adding the thirty-seven used items to the total of one hundred and forty-four. Used items must be subtracted."
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
      "uz": "Teng taqsimlash",
      "ru": "Равное распределение",
      "en": "Equal sharing"
    },
    "scene": "sharing",
    "closedSet": true,
    "frames": [
      {
        "uz": "5 qutida 28 tadan buyum bor, yana 20 ta qo'shildi.",
        "ru": "В 5 коробках по 28 предметов, добавили ещё 20.",
        "en": "There are 28 items in each of 5 boxes, plus 20 more."
      },
      {
        "uz": "Barchasi 8 guruhga teng taqsimlandi.",
        "ru": "Все предметы поровну распределили между 8 группами.",
        "en": "All the items were shared equally among 8 groups."
      }
    ],
    "question": {
      "uz": "Har guruhga nechta buyum tushdi?",
      "ru": "Сколько предметов досталось каждой группе?",
      "en": "How many items did each group receive?"
    },
    "options": [
      {
        "uz": "18",
        "ru": "18",
        "en": "18"
      },
      {
        "uz": "20",
        "ru": "20",
        "en": "20"
      },
      {
        "uz": "22",
        "ru": "22",
        "en": "22"
      }
    ],
    "correctIndex": 1,
    "proof": {
      "uz": "(5 × 28 + 20) ÷ 8 = 20, demak har guruhga 20 tadan tushadi.",
      "ru": "(5 × 28 + 20) ÷ 8 = 20, значит, в каждой группе будет по 20 предметов.",
      "en": "(5 × 28 + 20) ÷ 8 = 20, so each group receives 20 items."
    },
    "audio": {
      "intro": {
        "uz": [
          "Besh qutida yigirma sakkiztadan buyum bor, yana yigirmata qo'shildi.",
          "Barchasi sakkiz guruhga teng taqsimlandi."
        ],
        "ru": [
          "В пяти коробках по двадцать восемь предметов; добавили ещё двадцать.",
          "Все предметы поровну распределили между восемью группами."
        ],
        "en": [
          "There are twenty eight items in each of five boxes, plus twenty more.",
          "All the items were shared equally among eight groups."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Besh karra yigirma sakkizga yigirma qo'shsak, bir yuz oltmish bo'ladi. Uni sakkizga bo'lsak, har guruhga yigirmatadan tushadi.",
        "ru": "Верно. К пяти группам по двадцать восемь прибавляем двадцать и получаем сто шестьдесят. Делим на восемь, в каждой группе будет по двадцать предметов.",
        "en": "Correct. Add twenty to five groups of twenty eight to get one hundred and sixty. Divide by eight, so each group receives twenty items."
      },
      "on_wrong": [
        {
          "uz": "Yana bir qarang: Agar har guruhga o'n sakkiztadan berilsa, sakkiz guruhga bir yuz qirq to'rtta ketadi va o'n oltita ortib qoladi. Teng taqsimot yigirmatadan.",
          "ru": "Посмотрите ещё раз: Если дать каждой группе по восемнадцать, восьми группам достанется сто сорок четыре, а шестнадцать останутся. Поровну получается по двадцать.",
          "en": "Look again: Giving eighteen to each of eight groups uses one hundred and forty-four and leaves sixteen. Equal sharing gives twenty each."
        },
        {
          "uz": "To'g'ri. Besh karra yigirma sakkizga yigirma qo'shsak, bir yuz oltmish bo'ladi. Uni sakkizga bo'lsak, har guruhga yigirmatadan tushadi.",
          "ru": "Верно. К пяти группам по двадцать восемь прибавляем двадцать и получаем сто шестьдесят. Делим на восемь, в каждой группе будет по двадцать предметов.",
          "en": "Correct. Add twenty to five groups of twenty eight to get one hundred and sixty. Divide by eight, so each group receives twenty items."
        },
        {
          "uz": "Yana bir qarang: Agar har guruhga yigirma ikkitadan berilsa, sakkiz guruhga bir yuz yetmish oltita kerak, bu mavjud bir yuz oltmishtadan o'n oltita ko'p.",
          "ru": "Посмотрите ещё раз: Если дать каждой группе по двадцать два, для восьми групп потребуется сто семьдесят шесть, на шестнадцать больше имеющихся ста шестидесяти.",
          "en": "Look again: Giving twenty-two to each of eight groups would require one hundred and seventy-six, which is sixteen more than the available one hundred and sixty."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "Yana bir qarang: Agar har guruhga o'n sakkiztadan berilsa, sakkiz guruhga bir yuz qirq to'rtta ketadi va o'n oltita ortib qoladi. Teng taqsimot yigirmatadan.",
        "ru": "Посмотрите ещё раз: Если дать каждой группе по восемнадцать, восьми группам достанется сто сорок четыре, а шестнадцать останутся. Поровну получается по двадцать.",
        "en": "Look again: Giving eighteen to each of eight groups uses one hundred and forty-four and leaves sixteen. Equal sharing gives twenty each."
      },
      {
        "uz": "To'g'ri. Besh karra yigirma sakkizga yigirma qo'shsak, bir yuz oltmish bo'ladi. Uni sakkizga bo'lsak, har guruhga yigirmatadan tushadi.",
        "ru": "Верно. К пяти группам по двадцать восемь прибавляем двадцать и получаем сто шестьдесят. Делим на восемь, в каждой группе будет по двадцать предметов.",
        "en": "Correct. Add twenty to five groups of twenty eight to get one hundred and sixty. Divide by eight, so each group receives twenty items."
      },
      {
        "uz": "Yana bir qarang: Agar har guruhga yigirma ikkitadan berilsa, sakkiz guruhga bir yuz yetmish oltita kerak, bu mavjud bir yuz oltmishtadan o'n oltita ko'p.",
        "ru": "Посмотрите ещё раз: Если дать каждой группе по двадцать два, для восьми групп потребуется сто семьдесят шесть, на шестнадцать больше имеющихся ста шестидесяти.",
        "en": "Look again: Giving twenty-two to each of eight groups would require one hundred and seventy-six, which is sixteen more than the available one hundred and sixty."
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
      "uz": "Bit oraliq natijada to'xtadi",
      "ru": "Бит остановился на промежуточном результате",
      "en": "Bit stopped at the intermediate result"
    },
    "scene": "intermediate-error",
    "closedSet": true,
    "frames": [
      {
        "uz": "Bit 8 × 25 = 200 ni topdi.",
        "ru": "Бит вычислил 8 × 25 = 200.",
        "en": "Bit calculated 8 × 25 = 200."
      },
      {
        "uz": "Ammo masalaning yakuniy savoliga hali javob bermadi.",
        "ru": "Но он ещё не ответил на итоговый вопрос задачи.",
        "en": "But he has not answered the problem's final question yet."
      }
    ],
    "question": {
      "uz": "Bit nima qilishi kerak?",
      "ru": "Что должен сделать Бит?",
      "en": "What should Bit do?"
    },
    "options": [
      {
        "uz": "Keyingi amalni bajarishi kerak",
        "ru": "Выполнить следующее действие",
        "en": "Perform the next operation"
      },
      {
        "uz": "200 ni yakuniy javob deb yozishi kerak",
        "ru": "Записать 200 как итоговый ответ",
        "en": "Write 200 as the final answer"
      },
      {
        "uz": "Masalani qayta ko'paytirishi kerak",
        "ru": "Ещё раз выполнить умножение",
        "en": "Repeat the multiplication"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "200 faqat oraliq natija; yakuniy savol uchun keyingi amal bajarilishi kerak.",
      "ru": "200 — только промежуточный результат; для итогового ответа нужно выполнить следующее действие.",
      "en": "200 is only an intermediate result; the next operation is needed for the final answer."
    },
    "audio": {
      "intro": {
        "uz": [
          "Bit sakkiz karra yigirma beshni hisoblab, ikki yuzni topdi.",
          "Ammo masalaning yakuniy savoliga hali javob bermadi."
        ],
        "ru": [
          "Бит вычислил: восемь умножить на двадцать пять равно двумстам.",
          "Но он ещё не ответил на итоговый вопрос задачи."
        ],
        "en": [
          "Bit calculated eight multiplied by twenty five equals two hundred.",
          "But he has not answered the problem's final question yet."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Bit keyingi amalni bajarishi kerak. Ikki yuz faqat oraliq natija. Yakuniy javob uchun hisoblashni davom ettiring.",
        "ru": "Верно. Биту нужно выполнить следующее действие. Полученное число двести является только промежуточным результатом. Для итогового ответа продолжите решение.",
        "en": "Correct. Bit needs to perform the next operation. Two hundred is only an intermediate result. Continue the calculation to reach the final answer."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Bit keyingi amalni bajarishi kerak. Ikki yuz faqat oraliq natija. Yakuniy javob uchun hisoblashni davom ettiring.",
          "ru": "Верно. Биту нужно выполнить следующее действие. Полученное число двести является только промежуточным результатом. Для итогового ответа продолжите решение.",
          "en": "Correct. Bit needs to perform the next operation. Two hundred is only an intermediate result. Continue the calculation to reach the final answer."
        },
        {
          "uz": "Yana bir qarang: Ikki yuz faqat sakkizta guruhdagi yigirma beshtadan buyumning jami. Masalada yana yetmish oltini ayirish va to'rtta guruhga bo'lish kerak.",
          "ru": "Посмотрите ещё раз: Двести является только общим числом предметов в восьми группах по двадцать пять. Ещё нужно вычесть семьдесят шесть и разделить на четыре.",
          "en": "Look again: Two hundred is only the total in eight groups of twenty-five. The problem still requires subtracting seventy-six and dividing by four."
        },
        {
          "uz": "Yana bir qarang: Ko'paytirishni qaytarish yangi ma'lumot bermaydi. Ikki yuz oraliq natija tayyor; endi yetmish oltini ayirib, qolganini to'rtga bo'ling.",
          "ru": "Посмотрите ещё раз: Повторное умножение не даёт новой информации. Промежуточное число двести уже найдено; вычтите семьдесят шесть и разделите остаток на четыре.",
          "en": "Look again: Repeating the multiplication adds no new information. Two hundred is already known; subtract seventy-six, then divide the remainder by four."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Bit keyingi amalni bajarishi kerak. Ikki yuz faqat oraliq natija. Yakuniy javob uchun hisoblashni davom ettiring.",
        "ru": "Верно. Биту нужно выполнить следующее действие. Полученное число двести является только промежуточным результатом. Для итогового ответа продолжите решение.",
        "en": "Correct. Bit needs to perform the next operation. Two hundred is only an intermediate result. Continue the calculation to reach the final answer."
      },
      {
        "uz": "Yana bir qarang: Ikki yuz faqat sakkizta guruhdagi yigirma beshtadan buyumning jami. Masalada yana yetmish oltini ayirish va to'rtta guruhga bo'lish kerak.",
        "ru": "Посмотрите ещё раз: Двести является только общим числом предметов в восьми группах по двадцать пять. Ещё нужно вычесть семьдесят шесть и разделить на четыре.",
        "en": "Look again: Two hundred is only the total in eight groups of twenty-five. The problem still requires subtracting seventy-six and dividing by four."
      },
      {
        "uz": "Yana bir qarang: Ko'paytirishni qaytarish yangi ma'lumot bermaydi. Ikki yuz oraliq natija tayyor; endi yetmish oltini ayirib, qolganini to'rtga bo'ling.",
        "ru": "Посмотрите ещё раз: Повторное умножение не даёт новой информации. Промежуточное число двести уже найдено; вычтите семьдесят шесть и разделите остаток на четыре.",
        "en": "Look again: Repeating the multiplication adds no new information. Two hundred is already known; subtract seventy-six, then divide the remainder by four."
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
      "uz": "Uch amalli masala",
      "ru": "Задача в три действия",
      "en": "Three-step problem"
    },
    "scene": "three-operations",
    "closedSet": true,
    "frames": [
      {
        "uz": "Avval 8 × 25 = 200 ni hisoblang.",
        "ru": "Сначала вычислите 8 × 25 = 200.",
        "en": "First calculate 8 × 25 = 200."
      },
      {
        "uz": "Keyin 200 − 76 = 124 ni hisoblang.",
        "ru": "Затем вычислите 200 − 76 = 124.",
        "en": "Then calculate 200 − 76 = 124."
      },
      {
        "uz": "So'ng (200-76)÷4 ifodasini hisoblang.",
        "ru": "После этого вычислите выражение (200-76)÷4.",
        "en": "Next calculate the expression (200-76)÷4."
      }
    ],
    "question": {
      "uz": "Har guruhga nechta buyum tushadi?",
      "ru": "Сколько предметов будет в каждой группе?",
      "en": "How many items will be in each group?"
    },
    "options": [
      {
        "uz": "31",
        "ru": "31",
        "en": "31"
      },
      {
        "uz": "49",
        "ru": "49",
        "en": "49"
      },
      {
        "uz": "124",
        "ru": "124",
        "en": "124"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "(200−76)÷4 = 31, demak har guruhga 31 tadan tushadi.",
      "ru": "(200−76)÷4 = 31, значит, в каждой группе будет по 31 предмету.",
      "en": "(200−76)÷4 = 31, so each group receives 31 items."
    },
    "audio": {
      "intro": {
        "uz": [
          "Avval sakkiz karra yigirma beshni hisoblab, ikki yuzni toping.",
          "Keyin ikki yuzdan yetmish oltini ayirib, bir yuz yigirma to'rtni toping.",
          "So'ng bir yuz yigirma to'rtni to'rtga bo'ling."
        ],
        "ru": [
          "Сначала вычислите восемь умножить на двадцать пять и получите двести.",
          "Затем вычтите семьдесят шесть из двухсот и получите сто двадцать четыре.",
          "После этого разделите сто двадцать четыре на четыре."
        ],
        "en": [
          "First multiply eight by twenty five to get two hundred.",
          "Then subtract seventy six from two hundred to get one hundred and twenty four.",
          "Next divide one hundred and twenty four by four."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Ikki yuzdan yetmish oltini ayirib, bir yuz yigirma to'rtni olamiz. Uni to'rtga bo'lsak, har guruhga o'ttiz bittadan tushadi.",
        "ru": "Верно. Из двухсот вычитаем семьдесят шесть и получаем сто двадцать четыре. Делим на четыре, в каждой группе будет по тридцать одному предмету.",
        "en": "Correct. Subtract seventy six from two hundred to get one hundred and twenty four. Divide by four, so each group receives thirty one items."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Ikki yuzdan yetmish oltini ayirib, bir yuz yigirma to'rtni olamiz. Uni to'rtga bo'lsak, har guruhga o'ttiz bittadan tushadi.",
          "ru": "Верно. Из двухсот вычитаем семьдесят шесть и получаем сто двадцать четыре. Делим на четыре, в каждой группе будет по тридцать одному предмету.",
          "en": "Correct. Subtract seventy six from two hundred to get one hundred and twenty four. Divide by four, so each group receives thirty one items."
        },
        {
          "uz": "Yana bir qarang: Agar har guruhda qirq to'qqizta bo'lsa, to'rtta guruhga bir yuz to'qson oltita kerak bo'lardi. Ayirishdan keyin esa faqat bir yuz yigirma to'rtta qoladi.",
          "ru": "Посмотрите ещё раз: Если в каждой группе по сорок девять, четырём группам потребуется сто девяносто шесть. После вычитания остаётся только сто двадцать четыре.",
          "en": "Look again: If each group had forty-nine, four groups would require one hundred and ninety-six. Only one hundred and twenty-four remain after subtraction."
        },
        {
          "uz": "Yana bir qarang: Bir yuz yigirma to'rt ayirishdan keyingi oraliq natija, bitta guruhdagi son emas. Uni to'rtta teng guruhga bo'ling.",
          "ru": "Посмотрите ещё раз: Сто двадцать четыре является промежуточным результатом после вычитания, а не числом в одной группе. Разделите его на четыре равные группы.",
          "en": "Look again: One hundred and twenty-four is the intermediate result after subtraction, not the amount in one group. Divide it among four equal groups."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Ikki yuzdan yetmish oltini ayirib, bir yuz yigirma to'rtni olamiz. Uni to'rtga bo'lsak, har guruhga o'ttiz bittadan tushadi.",
        "ru": "Верно. Из двухсот вычитаем семьдесят шесть и получаем сто двадцать четыре. Делим на четыре, в каждой группе будет по тридцать одному предмету.",
        "en": "Correct. Subtract seventy six from two hundred to get one hundred and twenty four. Divide by four, so each group receives thirty one items."
      },
      {
        "uz": "Yana bir qarang: Agar har guruhda qirq to'qqizta bo'lsa, to'rtta guruhga bir yuz to'qson oltita kerak bo'lardi. Ayirishdan keyin esa faqat bir yuz yigirma to'rtta qoladi.",
        "ru": "Посмотрите ещё раз: Если в каждой группе по сорок девять, четырём группам потребуется сто девяносто шесть. После вычитания остаётся только сто двадцать четыре.",
        "en": "Look again: If each group had forty-nine, four groups would require one hundred and ninety-six. Only one hundred and twenty-four remain after subtraction."
      },
      {
        "uz": "Yana bir qarang: Bir yuz yigirma to'rt ayirishdan keyingi oraliq natija, bitta guruhdagi son emas. Uni to'rtta teng guruhga bo'ling.",
        "ru": "Посмотрите ещё раз: Сто двадцать четыре является промежуточным результатом после вычитания, а не числом в одной группе. Разделите его на четыре равные группы.",
        "en": "Look again: One hundred and twenty-four is the intermediate result after subtraction, not the amount in one group. Divide it among four equal groups."
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
      "uz": "Matndan yechimgacha",
      "ru": "От текста к решению",
      "en": "From text to solution"
    },
    "scene": "summary",
    "frames": [
      {
        "uz": "Yakuniy savolni tushuning.",
        "ru": "Поймите итоговый вопрос.",
        "en": "Understand the final question."
      },
      {
        "uz": "Yetishmayotgan oraliq miqdorni toping.",
        "ru": "Найдите недостающую промежуточную величину.",
        "en": "Find the missing intermediate quantity."
      },
      {
        "uz": "Masalani sxema yoki ifoda bilan modellang.",
        "ru": "Представьте задачу схемой или выражением.",
        "en": "Model the problem with a diagram or expression."
      },
      {
        "uz": "Amallarni to'g'ri tartibda bajaring.",
        "ru": "Выполните действия в правильном порядке.",
        "en": "Perform the operations in the correct order."
      },
      {
        "uz": "Keyingi darsda ikki obyekt harakatini o'rganamiz.",
        "ru": "На следующем уроке изучим движение двух объектов.",
        "en": "Next, we will study the motion of two objects."
      }
    ],
    "audio": {
      "uz": [
        "Yakuniy savolni tushuning.",
        "Yetishmayotgan oraliq miqdorni toping.",
        "Masalani sxema yoki ifoda bilan modellang.",
        "Amallarni to'g'ri tartibda bajaring.",
        "Keyingi darsda ikki obyekt harakatini o'rganamiz."
      ],
      "ru": [
        "Поймите итоговый вопрос.",
        "Найдите недостающую промежуточную величину.",
        "Представьте задачу схемой или выражением.",
        "Выполните действия в правильном порядке.",
        "На следующем уроке изучим движение двух объектов."
      ],
      "en": [
        "Understand the final question.",
        "Find the missing intermediate quantity.",
        "Model the problem with a diagram or expression.",
        "Perform the operations in the correct order.",
        "Next, we will study the motion of two objects."
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
    hook: ['?', '□', '✓'], 'simple-compound': ['①', '① + ②', '✓'],
    hidden: ['?', '□', '✓'], bar: ['□ + □', '□', '□'],
    'multiply-subtract': ['6 × 24', '144 − 37', '107'],
    'add-divide': ['5 × 28 + 20', '160 ÷ 8', '20'],
    check: ['□', '↔', '✓'], algorithm: ['?', '□', '✓'],
    'first-operation': ['7 × 18', '126', '✓'],
    'expression-choice': ['320 + 4 × 45 − 96', '404', '✓'],
    remaining: ['6 × 24 − 37', '107', '✓'],
    sharing: ['(5 × 28 + 20) ÷ 8', '20', '✓'],
    'intermediate-error': ['8 × 25 = 200', '200 → ?', '?'],
    'three-operations': ['8 × 25', '200 − 76', '124 ÷ 4 = 31'],
    summary: ['?', '□', '✓'],
  };
  const counts = {hook:7,algorithm:7,'multiply-subtract':6,'add-divide':5,'first-operation':7,'remaining':6,'sharing':5,'intermediate-error':8,'three-operations':8};
  const model = models[scene] || models.hook; const count = counts[scene] || 4;
  return <div className={'topic-visual topic-v44 scene-' + scene} aria-hidden="true"><svg viewBox="0 0 600 220">
    <g className={on(0)}>{Array.from({length:count},(_,i)=><g key={i} transform={'translate('+(34+i*(520/Math.max(count,1)))+' 28)'}><rect width={Math.min(54,450/count)} height="56" rx="10" fill="#FFF0EA" stroke="#FF5B35" strokeWidth="4"/><circle cx={Math.min(18,180/count)} cy="20" r="4" fill="#173B52"/><circle cx={Math.min(36,360/count)} cy="36" r="4" fill="#173B52"/></g>)}</g>
    <g className={on(1)}><rect x="54" y="108" width="492" height="48" rx="16" fill="#E5F5F6"/><rect x="54" y="108" width="330" height="48" rx="16" fill="#168FA3"/><rect x="384" y="108" width="162" height="48" rx="16" fill="#FF5B35"/><text x="300" y="139" textAnchor="middle" fill="#FFF" fontSize="21" fontWeight="900">{model[0]}</text></g>
    <g className={on(2)}><path d="M300 160 v34" stroke="#173B52" strokeWidth="4" strokeDasharray="8 7"/><path d="M291 188 l9 17 9-17z" fill="#173B52"/><rect x="170" y="164" width="260" height="40" rx="13" fill="#FFF" stroke="#168FA3" strokeWidth="3"/><text x="300" y="191" textAnchor="middle" fill="#173B52" fontSize="21" fontWeight="900">{model[1]}</text></g>
    <g className={on(3)}><rect x="448" y="166" width="126" height="40" rx="14" fill="#E7F3EC" stroke="#95C93D" strokeWidth="4"/><text x="511" y="193" textAnchor="middle" fill="#173B52" fontSize="20" fontWeight="900">{model[2]}</text></g>
    <g className={on(4)}><circle cx="570" cy="24" r="15" fill="#95C93D"/><path d="M562 24 l6 6 11-15" fill="none" stroke="#173B52" strokeWidth="4"/></g>
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
export default function Grade4Dars44({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) { const preview = previewMode ?? (langProp === undefined || langProp === null); const initialLang = normalizeLang(langProp); const [previewLang, setPreviewLang] = useState(initialLang); const lang = preview ? normalizeLang(previewLang) : initialLang; configureLesson({ ttsApiBase: ttsApiBase || '', voiceGender: voiceGender || 'f', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', previewMode: preview }); const [current, setCurrent] = useState(0); const [answers, setAnswers] = useState([]); const [startedAt] = useState(() => Date.now()); const finished = useRef(false); const recordAnswer = useCallback((answer) => setAnswers((previous) => { const next = [...previous]; const old = previous[answer.screenIdx]; next[answer.screenIdx] = { ...answer, firstTry: old ? old.firstTry : answer.firstTry }; return next; }), []); const finishLesson = useCallback(() => { if (finished.current) return; finished.current = true; const scored = SCREEN_META.map((meta, index) => meta.scored ? index : null).filter((index) => index !== null); const firstTryCorrect = scored.filter((index) => answers[index]?.firstTry === true).length; const payload = { lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle[lang], studentName: studentName || null, durationSec: Math.floor((Date.now() - startedAt) / 1000), totalQuestions: scored.length, correctAnswers: firstTryCorrect, scorePercent: Math.round(firstTryCorrect / scored.length * 100), finalScore: firstTryCorrect, finalTotal: scored.length, passed: firstTryCorrect / scored.length >= 0.6, firstTryStats: { total: scored.length, firstTryCorrect }, attemptsTotal: scored.reduce((sum, index) => sum + (answers[index]?.attempts ?? 0), 0), skillTags: LESSON_META.skillTags, answers: answers.filter(Boolean) }; if (onFinished) onFinished(payload); else console.log('[Grade4 Dars44 preview]', payload); }, [answers, lang, onFinished, startedAt, studentName]); const Current = SCREENS[current]; return <LangContext.Provider value={lang}><style>{STYLES}</style><div className={'lesson-root ' + (preview ? 'lesson-root-preview' : '')}>{preview && <div className="preview-language" aria-label={bi("Ko'rish tili", 'Язык предпросмотра', 'Preview language')[lang]}>{['uz', 'ru', 'en'].map((code) => <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} onPrev={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))} finishLesson={finishLesson}/></div></LangContext.Provider>; }

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
