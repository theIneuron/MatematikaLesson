import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// 4-sinf · Dars 31 · Kattaliklarga doir masalalar
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
const LESSON_KIND = "measure";
const LESSON_META = { lessonId: "measure-4-31-v1", slug: "dars31-kattaliklarga-doir-masalalar", lessonTitle: {"uz":"Kattaliklarga doir masalalar","ru":"Задачи с величинами","en":"Problems with measurements"}, skillTags: ["measure-model","mixed-units","operation-choice","reasonableness-check"] };
const CONTENT = {
  "s0": {
    "eyebrow": {
      "uz": "Muammo",
      "ru": "Проблема",
      "en": "Problem"
    },
    "title": {
      "uz": "Yashirin metr",
      "ru": "Скрытый метр",
      "en": "The hidden metre"
    },
    "scene": "measure-hook",
    "closedSet": true,
    "frames": [
      {
        "uz": "3 m 45 cm + 2 m 80 cm",
        "ru": "3 м 45 см + 2 м 80 см",
        "en": "3 m 45 cm + 2 m 80 cm"
      },
      {
        "uz": "5 m 125 cm",
        "ru": "5 м 125 см",
        "en": "5 m 125 cm"
      },
      {
        "uz": "Bu yakuniy yozuvmi?",
        "ru": "Это окончательная запись?",
        "en": "Is this the final notation?"
      }
    ],
    "question": {
      "uz": "Ikki kabel birga qancha uzun?",
      "ru": "Какова общая длина двух кабелей?",
      "en": "What is the total length of the two cables?"
    },
    "options": [
      {
        "uz": "5 m 125 cm",
        "ru": "5 м 125 см",
        "en": "5 m 125 cm"
      },
      {
        "uz": "6 m 25 cm",
        "ru": "6 м 25 см",
        "en": "6 m 25 cm"
      },
      {
        "uz": "6 m 125 cm",
        "ru": "6 м 125 см",
        "en": "6 m 125 cm"
      }
    ],
    "neutral": {
      "uz": "Taxmin saqlandi. Endi birliklarni bir xil ko'rinishga keltiramiz.",
      "ru": "Гипотеза сохранена. Теперь приведём единицы к одному виду.",
      "en": "Estimate saved. Now we will express the units in one form."
    },
    "audio": {
      "intro": {
        "uz": [
          "Ikki kabelning uzunliklarini qo'shamiz: uch metr qirq besh santimetr va ikki metr sakson santimetr.",
          "Dastlabki yozuv besh metr bir yuz yigirma besh santimetr.",
          "Bu yakuniy yozuvmi."
        ],
        "ru": [
          "Складываем длины двух кабелей: три метра сорок пять сантиметров и два метра восемьдесят сантиметров.",
          "Предварительная запись: пять метров сто двадцать пять сантиметров.",
          "Это окончательная запись?"
        ],
        "en": [
          "We add the lengths of two cables: three metres forty five centimetres and two metres eighty centimetres.",
          "The preliminary notation is five metres one hundred and twenty five centimetres.",
          "Is this the final notation?"
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
      "uz": "Masala xaritasi",
      "ru": "Карта задачи",
      "en": "Problem map"
    },
    "scene": "measure-map",
    "frames": [
      {
        "uz": "Ma'lum",
        "ru": "Известно",
        "en": "Known"
      },
      {
        "uz": "Topish kerak",
        "ru": "Нужно найти",
        "en": "Find"
      },
      {
        "uz": "Birlik",
        "ru": "Единица",
        "en": "Unit"
      },
      {
        "uz": "Bog'lanish",
        "ru": "Связь",
        "en": "Relationship"
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Masalada sonning o'zi yetmaydi kattalik birlik va savol orasidagi aloqani topish zarur. Ma'lum.",
          "Topish kerak",
          "Birlik.",
          "Bog'lanish."
        ],
        "ru": [
          "В задаче недостаточно увидеть числа нужно связать величину единицу и вопрос. Известно.",
          "Нужно найти",
          "Единица.",
          "Связь."
        ],
        "en": [
          "Numbers alone are not enough connect the measure its unit and the question. Known.",
          "Find",
          "Unit.",
          "Relationship."
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
      "uz": "Qismlar birlashsa",
      "ru": "Когда части объединяются",
      "en": "When parts combine"
    },
    "scene": "measure-add",
    "frames": [
      {
        "uz": "qism 1 + qism 2 = butun",
        "ru": "часть 1 + часть 2 = целое",
        "en": "part 1 + part 2 = whole"
      },
      {
        "uz": "3 m 45 cm = 345 cm",
        "ru": "3 м 45 см = 345 см",
        "en": "3 m 45 cm = 345 cm"
      },
      {
        "uz": "2 m 80 cm = 280 cm",
        "ru": "2 м 80 см = 280 см",
        "en": "2 m 80 cm = 280 cm"
      },
      {
        "uz": "345 + 280 = 625 cm",
        "ru": "345 + 280 = 625 см",
        "en": "345 + 280 = 625 cm"
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Qismlar bir butunni hosil qilgani uchun ularni avval bir xil birlikda qo'shamiz. Qism bir qo'shuv qism ikki teng butun.",
          "Uch metr qirq besh santimetr teng uch yuz qirq besh santimetr.",
          "Ikki metr sakson santimetr teng ikki yuz sakson santimetr.",
          "Uch yuz qirq besh qo'shuv ikki yuz sakson teng olti yuz yigirma besh santimetr."
        ],
        "ru": [
          "Части образуют целое поэтому сначала выражаем их в одной единице и складываем. Часть один плюс часть два равно целое.",
          "Три метра сорок пять сантиметров равны трёмстам сорока пяти сантиметрам.",
          "Два метра восемьдесят сантиметров равны двумстам восьмидесяти сантиметрам.",
          "Триста сорок пять плюс двести восемьдесят равно шестьсот двадцать пять сантиметров."
        ],
        "en": [
          "The parts form a whole so first express them in one unit and add. Part one plus part two equals whole.",
          "Three metres forty five centimetres equals three hundred and forty five centimetres.",
          "Two metres eighty centimetres equals two hundred and eighty centimetres.",
          "Three hundred and forty five plus two hundred and eighty equals six hundred and twenty five centimetres."
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
      "uz": "Butundan qism ajralsa",
      "ru": "Когда часть убирают",
      "en": "When a part is removed"
    },
    "scene": "measure-sub",
    "frames": [
      {
        "uz": "butun - ishlatilgan = qolgan",
        "ru": "целое - использовано = осталось",
        "en": "whole - used = remaining"
      },
      {
        "uz": "2 t 300 kg = 2300 kg",
        "ru": "2 т 300 кг = 2300 кг",
        "en": "2 t 300 kg = 2300 kg"
      },
      {
        "uz": "2300 - 750 = 1550 kg",
        "ru": "2300 - 750 = 1550 кг",
        "en": "2300 - 750 = 1550 kg"
      },
      {
        "uz": "1550 kg = 1 t 550 kg",
        "ru": "1550 кг = 1 т 550 кг",
        "en": "1550 kg = 1 t 550 kg"
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Qolgan miqdorni topishda ishlatilgan qism butundan ayiriladi va birliklar tenglashtiriladi. Butun ayiruv ishlatilgan teng qolgan.",
          "Ikki tonna uch yuz kilogramm teng ikki ming uch yuz kilogramm.",
          "Ikki ming uch yuz ayiruv yetti yuz ellik teng bir ming besh yuz ellik kilogramm.",
          "Bir ming besh yuz ellik kilogramm teng bir tonna besh yuz ellik kilogramm."
        ],
        "ru": [
          "Чтобы найти остаток использованную часть вычитают из целого после выравнивания единиц. Целое минус использовано равно осталось.",
          "Две тонны триста килограммов равны двум тысячам трёмстам килограммам.",
          "Две тысячи триста минус семьсот пятьдесят равно одна тысяча пятьсот пятьдесят килограммов.",
          "Одна тысяча пятьсот пятьдесят килограммов равна одной тонне пятистам пятидесяти килограммам."
        ],
        "en": [
          "To find what remains subtract the used part from the whole after aligning the units. Whole minus used equals remaining.",
          "Two tonnes three hundred kilograms equals two thousand three hundred kilograms.",
          "Two thousand three hundred minus seven hundred and fifty equals one thousand five hundred and fifty kilograms.",
          "One thousand five hundred and fifty kilograms equals one tonne five hundred and fifty kilograms."
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
      "uz": "Vaqt chegarasidan o'tish",
      "ru": "Переход через час",
      "en": "Crossing an hour boundary"
    },
    "scene": "measure-time",
    "frames": [
      {
        "uz": "1 h 45 min + 35 min",
        "ru": "1 ч 45 мин + 35 мин",
        "en": "1 h 45 min + 35 min"
      },
      {
        "uz": "45 + 35 = 80 min",
        "ru": "45 + 35 = 80 мин",
        "en": "45 + 35 = 80 min"
      },
      {
        "uz": "80 min = 1 h 20 min",
        "ru": "80 мин = 1 ч 20 мин",
        "en": "80 min = 1 h 20 min"
      },
      {
        "uz": "Javob: 2 h 20 min",
        "ru": "Ответ: 2 ч 20 мин",
        "en": "Answer: 2 h 20 min"
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Oltmish minut yangi soat hosil qiladi shuning uchun ortiqcha minutlarni qayta guruhlaymiz. Bir soat qirq besh minut qo'shuv o'ttiz besh minut.",
          "Qirq besh qo'shuv o'ttiz besh teng sakson minut",
          "Sakson minut teng bir soat yigirma minut.",
          "Javob ikki soat yigirma minut."
        ],
        "ru": [
          "Шестьдесят минут образуют новый час поэтому лишние минуты нужно перегруппировать. Один час сорок пять минут плюс тридцать пять минут.",
          "Сорок пять плюс тридцать пять равно восемьдесят минут",
          "Восемьдесят минут составляют один час двадцать минут.",
          "Ответ два часа двадцать минут."
        ],
        "en": [
          "Sixty minutes make a new hour so regroup any extra minutes. One hour forty five minutes plus thirty five minutes.",
          "Forty five plus thirty five equals eighty minutes",
          "Eighty minutes is equivalent to one hour and twenty minutes.",
          "Answer two hours twenty minutes."
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
      "uz": "Bir xil qismlar takrorlansa",
      "ru": "Когда равные части повторяются",
      "en": "When equal parts repeat"
    },
    "scene": "measure-repeat",
    "frames": [
      {
        "uz": "Bitta qism: 1 m 25 cm",
        "ru": "Одна часть: 1 м 25 см",
        "en": "One piece: 1 m 25 cm"
      },
      {
        "uz": "4 ta bir xil qism",
        "ru": "4 одинаковые части",
        "en": "4 equal pieces"
      },
      {
        "uz": "125 × 4 = 500 cm",
        "ru": "125 × 4 = 500 см",
        "en": "125 × 4 = 500 cm"
      },
      {
        "uz": "500 cm = 5 m",
        "ru": "500 см = 5 м",
        "en": "500 cm = 5 m"
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Bir xil uzunlik bir necha marta takrorlansa avval bitta qismini qulay birlikka keltirib ko'paytiramiz. Bitta qism bir metr yigirma besh santimetr.",
          "To'rtta bir xil qism",
          "Bir yuz yigirma besh ko'paytirilsin to'rt teng besh yuz santimetr.",
          "Besh yuz santimetr teng besh metr."
        ],
        "ru": [
          "Если одинаковая длина повторяется сначала переводим одну часть в удобную единицу и умножаем. Одна часть один метр двадцать пять сантиметров.",
          "Четыре одинаковые части",
          "Сто двадцать пять умножить на четыре равно пятьсот сантиметров.",
          "Пятьсот сантиметров равно пять метров."
        ],
        "en": [
          "When an equal length repeats convert one piece to a convenient unit and multiply. One piece one metre twenty five centimetres.",
          "Four equal pieces",
          "One hundred and twenty five multiplied by four equals five hundred centimetres.",
          "Five hundred centimetres equals five metres."
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
      "uz": "Yechish algoritmi",
      "ru": "Алгоритм решения",
      "en": "Solving algorithm"
    },
    "scene": "measure-rule",
    "frames": [
      {
        "uz": "Savolni toping",
        "ru": "Найдите вопрос",
        "en": "Identify the question"
      },
      {
        "uz": "Bir xil birliklarga keltiring",
        "ru": "Приведите к одинаковым единицам",
        "en": "Convert to the same units"
      },
      {
        "uz": "Model va amalni tanlang",
        "ru": "Выберите модель и действие",
        "en": "Choose the model and operation"
      },
      {
        "uz": "Hisoblang, yozing va tekshiring",
        "ru": "Вычислите, запишите и проверьте",
        "en": "Calculate, write and check"
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Yechim ishonchli bo'lishi uchun savol birlik model hisob va tekshiruv izchil bajariladi. Savolni toping.",
          "Bir xil birliklarga keltiring",
          "Model va amalni tanlang.",
          "Hisoblang yozing va tekshiring."
        ],
        "ru": [
          "Надёжное решение последовательно проходит вопрос единицу модель вычисление и проверку. Найдите вопрос.",
          "Приведите к одинаковым единицам",
          "Выберите модель и действие.",
          "Вычислите запишите и проверьте."
        ],
        "en": [
          "A reliable solution follows the question unit model calculation and check in order. Identify the question.",
          "Convert to the same units",
          "Choose the model and operation.",
          "Calculate write and check."
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
      "uz": "Kabel hisobi tuzatildi",
      "ru": "Расчёт кабеля исправлен",
      "en": "The cable calculation is fixed"
    },
    "scene": "measure-payoff",
    "frames": [
      {
        "uz": "3 m 45 cm = 345 cm",
        "ru": "3 м 45 см = 345 см",
        "en": "3 m 45 cm = 345 cm"
      },
      {
        "uz": "2 m 80 cm = 280 cm",
        "ru": "2 м 80 см = 280 см",
        "en": "2 m 80 cm = 280 cm"
      },
      {
        "uz": "345 cm + 280 cm = 625 cm",
        "ru": "345 см + 280 см = 625 см",
        "en": "345 cm + 280 cm = 625 cm"
      },
      {
        "uz": "625 cm = 6 m 25 cm",
        "ru": "625 см = 6 м 25 см",
        "en": "625 cm = 6 m 25 cm"
      },
      {
        "uz": "Mantiqan: 6 m dan biroz uzun",
        "ru": "Разумно: немного больше 6 м",
        "en": "Sensible: just over 6 m"
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Uch metr qirq besh santimetr teng uch yuz qirq besh santimetr.",
          "Ikki metr sakson santimetr teng ikki yuz sakson santimetr.",
          "Uch yuz qirq besh qo'shuv ikki yuz sakson teng olti yuz yigirma besh santimetr.",
          "Olti yuz yigirma besh santimetr teng olti metr yigirma besh santimetr.",
          "Natija mantiqan olti metrdan biroz uzun."
        ],
        "ru": [
          "Три метра сорок пять сантиметров равны трёмстам сорока пяти сантиметрам.",
          "Два метра восемьдесят сантиметров равны двумстам восьмидесяти сантиметрам.",
          "Триста сорок пять плюс двести восемьдесят равно шестьсот двадцать пять сантиметров.",
          "Шестьсот двадцать пять сантиметров равны шести метрам двадцати пяти сантиметрам.",
          "Разумно немного больше шести метров."
        ],
        "en": [
          "Three metres forty five centimetres equals three hundred and forty five centimetres.",
          "Two metres eighty centimetres equals two hundred and eighty centimetres.",
          "Three hundred and forty five plus two hundred and eighty equals six hundred and twenty five centimetres.",
          "Six hundred and twenty five centimetres equals six metres twenty five centimetres.",
          "Sensible just over six metres."
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
      "uz": "Uzunliklar yig'indisi",
      "ru": "Сумма длин",
      "en": "Adding lengths"
    },
    "scene": "measure-add",
    "frames": [
      {
        "uz": "3 km 250 m + 750 m",
        "ru": "3 км 250 м + 750 м",
        "en": "3 km 250 m + 750 m"
      },
      {
        "uz": "Natijani standart ko'rinishda yozing",
        "ru": "Запишите результат в стандартном виде",
        "en": "Write the result in standard form"
      }
    ],
    "question": {
      "uz": "Yig'indi qancha?",
      "ru": "Чему равна сумма?",
      "en": "What is the total?"
    },
    "options": [
      {
        "uz": "3 km 1000 m",
        "ru": "3 км 1000 м",
        "en": "3 km 1000 m"
      },
      {
        "uz": "4 km",
        "ru": "4 км",
        "en": "4 km"
      },
      {
        "uz": "4 km 250 m",
        "ru": "4 км 250 м",
        "en": "4 km 250 m"
      }
    ],
    "correctIndex": 1,
    "closedSet": true,
    "proof": {
      "uz": "3 km 250 m + 750 m = 4 km",
      "ru": "3 км 250 м + 750 м = 4 км",
      "en": "3 km 250 m + 750 m = 4 km"
    },
    "feedbackAudio": [
      {
        "uz": "Yana bir qarang: Uch kilometr va bir ming metr to'rt kilometrga teng, lekin bu standart yozuv emas. Ming metr yana bir kilometr bo'ladi.",
        "ru": "Посмотрите ещё раз: Три километра и одна тысяча метров равны четырём километрам, но запись нестандартна. Тысяча метров составляет ещё один километр.",
        "en": "Look again: Three kilometres and one thousand metres equal four kilometres, but this is not standard form. One thousand metres is another kilometre."
      },
      {
        "uz": "To'g'ri. Uch kilometr ikki yuz ellik metr qo'shuv yetti yuz ellik metr teng to'rt kilometr.",
        "ru": "Верно. Три километра двести пятьдесят метров плюс семьсот пятьдесят метров равно четыре километра.",
        "en": "Correct. Three kilometres two hundred and fifty metres plus seven hundred and fifty metres equals four kilometres."
      },
      {
        "uz": "Yana bir qarang: Yetti yuz ellik metr ikki yuz ellik metrni ming metrgacha to'ldiradi. Ortiqcha ikki yuz ellik metr qolmaydi.",
        "ru": "Посмотрите ещё раз: Семьсот пятьдесят метров дополняют двести пятьдесят метров до тысячи. Лишних двухсот пятидесяти метров не остаётся.",
        "en": "Look again: Seven hundred and fifty metres completes two hundred and fifty metres to make one thousand. No extra two hundred and fifty metres remains."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Uch kilometr ikki yuz ellik metrga yetti yuz ellik metr qo'shiladi.",
          "Javobning standart ko'rinishini tanlang."
        ],
        "ru": [
          "К трём километрам двумстам пятидесяти метрам прибавляют семьсот пятьдесят метров.",
          "Выберите стандартную запись ответа."
        ],
        "en": [
          "Add seven hundred and fifty metres to three kilometres two hundred and fifty metres.",
          "Choose the answer in standard form."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Uch kilometr ikki yuz ellik metr qo'shuv yetti yuz ellik metr teng to'rt kilometr.",
        "ru": "Верно. Три километра двести пятьдесят метров плюс семьсот пятьдесят метров равно четыре километра.",
        "en": "Correct. Three kilometres two hundred and fifty metres plus seven hundred and fifty metres equals four kilometres."
      },
      "on_wrong": [
        {
          "uz": "Yana bir qarang: Uch kilometr va bir ming metr to'rt kilometrga teng, lekin bu standart yozuv emas. Ming metr yana bir kilometr bo'ladi.",
          "ru": "Посмотрите ещё раз: Три километра и одна тысяча метров равны четырём километрам, но запись нестандартна. Тысяча метров составляет ещё один километр.",
          "en": "Look again: Three kilometres and one thousand metres equal four kilometres, but this is not standard form. One thousand metres is another kilometre."
        },
        {
          "uz": "To'g'ri. Uch kilometr ikki yuz ellik metr qo'shuv yetti yuz ellik metr teng to'rt kilometr.",
          "ru": "Верно. Три километра двести пятьдесят метров плюс семьсот пятьдесят метров равно четыре километра.",
          "en": "Correct. Three kilometres two hundred and fifty metres plus seven hundred and fifty metres equals four kilometres."
        },
        {
          "uz": "Yana bir qarang: Yetti yuz ellik metr ikki yuz ellik metrni ming metrgacha to'ldiradi. Ortiqcha ikki yuz ellik metr qolmaydi.",
          "ru": "Посмотрите ещё раз: Семьсот пятьдесят метров дополняют двести пятьдесят метров до тысячи. Лишних двухсот пятидесяти метров не остаётся.",
          "en": "Look again: Seven hundred and fifty metres completes two hundred and fifty metres to make one thousand. No extra two hundred and fifty metres remains."
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
      "uz": "Qolgan massa",
      "ru": "Оставшаяся масса",
      "en": "Remaining mass"
    },
    "scene": "measure-sub",
    "frames": [
      {
        "uz": "2 t 300 kg - 750 kg",
        "ru": "2 т 300 кг - 750 кг",
        "en": "2 t 300 kg - 750 kg"
      },
      {
        "uz": "Qolgan massani toping",
        "ru": "Найдите оставшуюся массу",
        "en": "Find the remaining mass"
      }
    ],
    "question": {
      "uz": "Qancha massa qoldi?",
      "ru": "Какая масса осталась?",
      "en": "How much mass remains?"
    },
    "options": [
      {
        "uz": "1 t 450 kg",
        "ru": "1 т 450 кг",
        "en": "1 t 450 kg"
      },
      {
        "uz": "1 t 550 kg",
        "ru": "1 т 550 кг",
        "en": "1 t 550 kg"
      },
      {
        "uz": "2 t 50 kg",
        "ru": "2 т 50 кг",
        "en": "2 t 50 kg"
      }
    ],
    "correctIndex": 1,
    "closedSet": true,
    "proof": {
      "uz": "2300 - 750 = 1550 kg = 1 t 550 kg",
      "ru": "2300 - 750 = 1550 кг = 1 т 550 кг",
      "en": "2300 - 750 = 1550 kg = 1 t 550 kg"
    },
    "feedbackAudio": [
      {
        "uz": "Yana bir qarang: Yuzlikdan o'tishda xato bor. Ikki ming uch yuzdan yetti yuz ellik ayirilsa, bir ming besh yuz ellik kilogramm qoladi.",
        "ru": "Посмотрите ещё раз: Ошибка возникла при переходе через сотню. После вычитания семисот пятидесяти из двух тысяч трёхсот остаётся одна тысяча пятьсот пятьдесят килограммов.",
        "en": "Look again: The regrouping across the hundreds is incorrect. Subtracting seven hundred and fifty from two thousand three hundred leaves one thousand five hundred and fifty kilograms."
      },
      {
        "uz": "To'g'ri. Ikki ming uch yuz ayiruv yetti yuz ellik teng bir ming besh yuz ellik kilogramm teng bir tonna besh yuz ellik kilogramm.",
        "ru": "Верно. Две тысячи триста минус семьсот пятьдесят равно одна тысяча пятьсот пятьдесят килограммов равно одна тонна пятьсот пятьдесят килограммов.",
        "en": "Correct. Two thousand three hundred minus seven hundred and fifty equals one thousand five hundred and fifty kilograms equals one tonne five hundred and fifty kilograms."
      },
      {
        "uz": "Yana bir qarang: Ikki tonna o'zgarishsiz qolmaydi. Ayirishdan keyin bir ming besh yuz ellik kilogramm, ya'ni bir tonna besh yuz ellik kilogramm qoladi.",
        "ru": "Посмотрите ещё раз: Две тонны не сохраняются без изменения. После вычитания остаётся одна тонна пятьсот пятьдесят килограммов.",
        "en": "Look again: The two tonnes do not remain unchanged. After the subtraction, one tonne five hundred and fifty kilograms remains."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Ikki tonna uch yuz kilogrammdan yetti yuz ellik kilogramm olindi.",
          "Qolgan massani toping."
        ],
        "ru": [
          "Из двух тонн трёхсот килограммов вычли семьсот пятьдесят килограммов.",
          "Найдите оставшуюся массу."
        ],
        "en": [
          "Seven hundred and fifty kilograms is removed from two tonnes three hundred kilograms.",
          "Find the remaining mass."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Ikki ming uch yuz ayiruv yetti yuz ellik teng bir ming besh yuz ellik kilogramm teng bir tonna besh yuz ellik kilogramm.",
        "ru": "Верно. Две тысячи триста минус семьсот пятьдесят равно одна тысяча пятьсот пятьдесят килограммов равно одна тонна пятьсот пятьдесят килограммов.",
        "en": "Correct. Two thousand three hundred minus seven hundred and fifty equals one thousand five hundred and fifty kilograms equals one tonne five hundred and fifty kilograms."
      },
      "on_wrong": [
        {
          "uz": "Yana bir qarang: Yuzlikdan o'tishda xato bor. Ikki ming uch yuzdan yetti yuz ellik ayirilsa, bir ming besh yuz ellik kilogramm qoladi.",
          "ru": "Посмотрите ещё раз: Ошибка возникла при переходе через сотню. После вычитания семисот пятидесяти из двух тысяч трёхсот остаётся одна тысяча пятьсот пятьдесят килограммов.",
          "en": "Look again: The regrouping across the hundreds is incorrect. Subtracting seven hundred and fifty from two thousand three hundred leaves one thousand five hundred and fifty kilograms."
        },
        {
          "uz": "To'g'ri. Ikki ming uch yuz ayiruv yetti yuz ellik teng bir ming besh yuz ellik kilogramm teng bir tonna besh yuz ellik kilogramm.",
          "ru": "Верно. Две тысячи триста минус семьсот пятьдесят равно одна тысяча пятьсот пятьдесят килограммов равно одна тонна пятьсот пятьдесят килограммов.",
          "en": "Correct. Two thousand three hundred minus seven hundred and fifty equals one thousand five hundred and fifty kilograms equals one tonne five hundred and fifty kilograms."
        },
        {
          "uz": "Yana bir qarang: Ikki tonna o'zgarishsiz qolmaydi. Ayirishdan keyin bir ming besh yuz ellik kilogramm, ya'ni bir tonna besh yuz ellik kilogramm qoladi.",
          "ru": "Посмотрите ещё раз: Две тонны не сохраняются без изменения. После вычитания остаётся одна тонна пятьсот пятьдесят килограммов.",
          "en": "Look again: The two tonnes do not remain unchanged. After the subtraction, one tonne five hundred and fifty kilograms remains."
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
      "uz": "Tadbir davomiyligi",
      "ru": "Продолжительность события",
      "en": "Event duration"
    },
    "scene": "measure-time",
    "frames": [
      {
        "uz": "1 h 45 min + 35 min",
        "ru": "1 ч 45 мин + 35 мин",
        "en": "1 h 45 min + 35 min"
      },
      {
        "uz": "Jami vaqtning standart yozuvini tanlang",
        "ru": "Выберите стандартную запись общей продолжительности",
        "en": "Choose the total duration in standard form"
      }
    ],
    "question": {
      "uz": "Jami vaqtning standart yozuvini tanlang.",
      "ru": "Выберите стандартную запись общей продолжительности.",
      "en": "Choose the total duration in standard form."
    },
    "options": [
      {
        "uz": "1 h 80 min",
        "ru": "1 ч 80 мин",
        "en": "1 h 80 min"
      },
      {
        "uz": "2 h 20 min",
        "ru": "2 ч 20 мин",
        "en": "2 h 20 min"
      },
      {
        "uz": "2 h 10 min",
        "ru": "2 ч 10 мин",
        "en": "2 h 10 min"
      }
    ],
    "correctIndex": 1,
    "closedSet": true,
    "proof": {
      "uz": "1 h 45 min + 35 min = 2 h 20 min",
      "ru": "1 ч 45 мин + 35 мин = 2 ч 20 мин",
      "en": "1 h 45 min + 35 min = 2 h 20 min"
    },
    "feedbackAudio": [
      {
        "uz": "Yana bir qarang: Bir soat sakson minut qiymatan teng, lekin standart yozuv emas. Sakson minut bir soat yigirma minutga teng.",
        "ru": "Посмотрите ещё раз: Один час восемьдесят минут равен по величине, но запись нестандартна. Восемьдесят минут равны одному часу двадцати минутам.",
        "en": "Look again: One hour eighty minutes has the same value, but it is not standard form. Eighty minutes is equivalent to one hour and twenty minutes."
      },
      {
        "uz": "To'g'ri. Bir soat qirq besh minut qo'shuv o'ttiz besh minut teng ikki soat yigirma minut.",
        "ru": "Верно. Один час сорок пять минут плюс тридцать пять минут равно два часа двадцать минут.",
        "en": "Correct. One hour forty five minutes plus thirty five minutes equals two hours twenty minutes."
      },
      {
        "uz": "Yana bir qarang: Qirq besh minut bilan o'ttiz besh minut yig'indisi yetmish minut emas, sakson minut.",
        "ru": "Посмотрите ещё раз: Сумма сорока пяти и тридцати пяти минут равна не семидесяти, а восьмидесяти минутам.",
        "en": "Look again: The sum of forty five minutes and thirty five minutes is eighty minutes, not seventy minutes."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Tadbir bir soat qirq besh minut davom etdi, keyin yana o'ttiz besh minut davom etdi.",
          "Jami vaqtning standart yozuvini tanlang."
        ],
        "ru": [
          "Событие длилось один час сорок пять минут, затем ещё тридцать пять минут.",
          "Выберите стандартную запись общей продолжительности."
        ],
        "en": [
          "An event lasts one hour forty five minutes, then continues for thirty five more minutes.",
          "Choose the total duration in standard form."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Bir soat qirq besh minut qo'shuv o'ttiz besh minut teng ikki soat yigirma minut.",
        "ru": "Верно. Один час сорок пять минут плюс тридцать пять минут равно два часа двадцать минут.",
        "en": "Correct. One hour forty five minutes plus thirty five minutes equals two hours twenty minutes."
      },
      "on_wrong": [
        {
          "uz": "Yana bir qarang: Bir soat sakson minut qiymatan teng, lekin standart yozuv emas. Sakson minut bir soat yigirma minutga teng.",
          "ru": "Посмотрите ещё раз: Один час восемьдесят минут равен по величине, но запись нестандартна. Восемьдесят минут равны одному часу двадцати минутам.",
          "en": "Look again: One hour eighty minutes has the same value, but it is not standard form. Eighty minutes is equivalent to one hour and twenty minutes."
        },
        {
          "uz": "To'g'ri. Bir soat qirq besh minut qo'shuv o'ttiz besh minut teng ikki soat yigirma minut.",
          "ru": "Верно. Один час сорок пять минут плюс тридцать пять минут равно два часа двадцать минут.",
          "en": "Correct. One hour forty five minutes plus thirty five minutes equals two hours twenty minutes."
        },
        {
          "uz": "Yana bir qarang: Qirq besh minut bilan o'ttiz besh minut yig'indisi yetmish minut emas, sakson minut.",
          "ru": "Посмотрите ещё раз: Сумма сорока пяти и тридцати пяти минут равна не семидесяти, а восьмидесяти минутам.",
          "en": "Look again: The sum of forty five minutes and thirty five minutes is eighty minutes, not seventy minutes."
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
      "uz": "Standart yozuv",
      "ru": "Стандартная запись",
      "en": "Standard form"
    },
    "scene": "measure-standard",
    "frames": [
      {
        "uz": "4 kg 80 g + 920 g",
        "ru": "4 кг 80 г + 920 г",
        "en": "4 kg 80 g + 920 g"
      },
      {
        "uz": "Standart ko'rinishni tanlang",
        "ru": "Выберите стандартную запись",
        "en": "Choose the standard notation"
      }
    ],
    "question": {
      "uz": "Standart yozuvni tanlang.",
      "ru": "Выберите стандартную запись.",
      "en": "Choose the standard notation."
    },
    "options": [
      {
        "uz": "4 kg 1000 g",
        "ru": "4 кг 1000 г",
        "en": "4 kg 1000 g"
      },
      {
        "uz": "5 kg",
        "ru": "5 кг",
        "en": "5 kg"
      },
      {
        "uz": "5 kg 80 g",
        "ru": "5 кг 80 г",
        "en": "5 kg 80 g"
      }
    ],
    "correctIndex": 1,
    "closedSet": true,
    "proof": {
      "uz": "4 kg 80 g + 920 g = 5 kg",
      "ru": "4 кг 80 г + 920 г = 5 кг",
      "en": "4 kg 80 g + 920 g = 5 kg"
    },
    "feedbackAudio": [
      {
        "uz": "Yana bir qarang: To'rt kilogramm bir ming gramm qiymatan teng, lekin standart yozuv emas. Bir ming gramm yana bir kilogramm bo'ladi.",
        "ru": "Посмотрите ещё раз: Четыре килограмма одна тысяча граммов равны по величине, но запись нестандартна. Тысяча граммов составляет ещё один килограмм.",
        "en": "Look again: Four kilograms one thousand grams has the same value, but it is not standard form. One thousand grams is another kilogram."
      },
      {
        "uz": "To'g'ri. To'rt kilogramm sakson gramm qo'shuv to'qqiz yuz yigirma gramm teng besh kilogramm.",
        "ru": "Верно. Четыре килограмма восемьдесят граммов плюс девятьсот двадцать граммов равно пять килограммов.",
        "en": "Correct. Four kilograms eighty grams plus nine hundred and twenty grams equals five kilograms."
      },
      {
        "uz": "Yana bir qarang: Sakson gramm bilan to'qqiz yuz yigirma gramm yig'indisi aynan bir ming gramm. Ortiqcha sakson gramm qolmaydi.",
        "ru": "Посмотрите ещё раз: Сумма восьмидесяти и девятисот двадцати граммов равна ровно тысяче граммов. Лишних восьмидесяти граммов не остаётся.",
        "en": "Look again: Eighty grams plus nine hundred and twenty grams is exactly one thousand grams. No extra eighty grams remains."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "To'rt kilogramm sakson grammga to'qqiz yuz yigirma gramm qo'shiladi.",
          "Standart yozuvni tanlang."
        ],
        "ru": [
          "К четырём килограммам восьмидесяти граммам прибавляют девятьсот двадцать граммов.",
          "Выберите стандартную запись."
        ],
        "en": [
          "Add nine hundred and twenty grams to four kilograms eighty grams.",
          "Choose the standard notation."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. To'rt kilogramm sakson gramm qo'shuv to'qqiz yuz yigirma gramm teng besh kilogramm.",
        "ru": "Верно. Четыре килограмма восемьдесят граммов плюс девятьсот двадцать граммов равно пять килограммов.",
        "en": "Correct. Four kilograms eighty grams plus nine hundred and twenty grams equals five kilograms."
      },
      "on_wrong": [
        {
          "uz": "Yana bir qarang: To'rt kilogramm bir ming gramm qiymatan teng, lekin standart yozuv emas. Bir ming gramm yana bir kilogramm bo'ladi.",
          "ru": "Посмотрите ещё раз: Четыре килограмма одна тысяча граммов равны по величине, но запись нестандартна. Тысяча граммов составляет ещё один килограмм.",
          "en": "Look again: Four kilograms one thousand grams has the same value, but it is not standard form. One thousand grams is another kilogram."
        },
        {
          "uz": "To'g'ri. To'rt kilogramm sakson gramm qo'shuv to'qqiz yuz yigirma gramm teng besh kilogramm.",
          "ru": "Верно. Четыре килограмма восемьдесят граммов плюс девятьсот двадцать граммов равно пять килограммов.",
          "en": "Correct. Four kilograms eighty grams plus nine hundred and twenty grams equals five kilograms."
        },
        {
          "uz": "Yana bir qarang: Sakson gramm bilan to'qqiz yuz yigirma gramm yig'indisi aynan bir ming gramm. Ortiqcha sakson gramm qolmaydi.",
          "ru": "Посмотрите ещё раз: Сумма восьмидесяти и девятисот двадцати граммов равна ровно тысяче граммов. Лишних восьмидесяти граммов не остаётся.",
          "en": "Look again: Eighty grams plus nine hundred and twenty grams is exactly one thousand grams. No extra eighty grams remains."
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
      "uz": "Bitning ortiqcha birligi",
      "ru": "Лишняя единица Бита",
      "en": "Bit's unconverted unit"
    },
    "scene": "measure-bit",
    "frames": [
      {
        "uz": "Bit: 4 kg 1000 g",
        "ru": "Бит: 4 кг 1000 г",
        "en": "Bit: 4 kg 1000 g"
      },
      {
        "uz": "Bit yozuvini to'g'rilang",
        "ru": "Исправьте запись Бита",
        "en": "Correct Bit's notation"
      }
    ],
    "question": {
      "uz": "Bit yozuvini to'g'rilang.",
      "ru": "Исправьте запись Бита.",
      "en": "Correct Bit's notation."
    },
    "options": [
      {
        "uz": "5 kg",
        "ru": "5 кг",
        "en": "5 kg"
      },
      {
        "uz": "4 kg 100 g",
        "ru": "4 кг 100 г",
        "en": "4 kg 100 g"
      },
      {
        "uz": "4 kg 10 g",
        "ru": "4 кг 10 г",
        "en": "4 kg 10 g"
      }
    ],
    "correctIndex": 0,
    "closedSet": true,
    "proof": {
      "uz": "4 kg 1000 g = 5 kg",
      "ru": "4 кг 1000 г = 5 кг",
      "en": "4 kg 1000 g = 5 kg"
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. To'rt kilogramm bir ming gramm teng besh kilogramm.",
        "ru": "Верно. Четыре килограмма одна тысяча граммов равно пять килограммов.",
        "en": "Correct. Four kilograms one thousand grams equals five kilograms."
      },
      {
        "uz": "Yana bir qarang: Bu yozuv bir ming grammni bir yuz gramm deb olgan. Aslida bir ming gramm bir kilogrammga teng.",
        "ru": "Посмотрите ещё раз: В этой записи тысяча граммов принята за сто граммов. На самом деле тысяча граммов равна одному килограмму.",
        "en": "Look again: This treats one thousand grams as one hundred grams. In fact, one thousand grams equals one kilogram."
      },
      {
        "uz": "Yana bir qarang: Bu yozuv bir ming grammni o'n gramm deb olgan. Aslida bir ming gramm bir kilogrammga teng.",
        "ru": "Посмотрите ещё раз: В этой записи тысяча граммов принята за десять граммов. На самом деле тысяча граммов равна одному килограмму.",
        "en": "Look again: This treats one thousand grams as ten grams. In fact, one thousand grams equals one kilogram."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Bit to'rt kilogramm bir ming gramm deb yozdi.",
          "Bit yozuvini to'g'rilang."
        ],
        "ru": [
          "Бит записал четыре килограмма одну тысячу граммов.",
          "Исправьте запись Бита."
        ],
        "en": [
          "Bit wrote four kilograms one thousand grams.",
          "Correct Bit's notation."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. To'rt kilogramm bir ming gramm teng besh kilogramm.",
        "ru": "Верно. Четыре килограмма одна тысяча граммов равно пять килограммов.",
        "en": "Correct. Four kilograms one thousand grams equals five kilograms."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. To'rt kilogramm bir ming gramm teng besh kilogramm.",
          "ru": "Верно. Четыре килограмма одна тысяча граммов равно пять килограммов.",
          "en": "Correct. Four kilograms one thousand grams equals five kilograms."
        },
        {
          "uz": "Yana bir qarang: Bu yozuv bir ming grammni bir yuz gramm deb olgan. Aslida bir ming gramm bir kilogrammga teng.",
          "ru": "Посмотрите ещё раз: В этой записи тысяча граммов принята за сто граммов. На самом деле тысяча граммов равна одному килограмму.",
          "en": "Look again: This treats one thousand grams as one hundred grams. In fact, one thousand grams equals one kilogram."
        },
        {
          "uz": "Yana bir qarang: Bu yozuv bir ming grammni o'n gramm deb olgan. Aslida bir ming gramm bir kilogrammga teng.",
          "ru": "Посмотрите ещё раз: В этой записи тысяча граммов принята за десять граммов. На самом деле тысяча граммов равна одному килограмму.",
          "en": "Look again: This treats one thousand grams as ten grams. In fact, one thousand grams equals one kilogram."
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
      "uz": "Ta'mirlash kabeli",
      "ru": "Кабель для ремонта",
      "en": "Repair cable"
    },
    "scene": "measure-case",
    "frames": [
      {
        "uz": "1 m 75 cm; 2 m 40 cm; 85 cm",
        "ru": "1 м 75 см; 2 м 40 см; 85 см",
        "en": "1 m 75 cm; 2 m 40 cm; 85 cm"
      },
      {
        "uz": "175 + 240 + 85 = ? cm",
        "ru": "175 + 240 + 85 = ? см",
        "en": "175 + 240 + 85 = ? cm"
      },
      {
        "uz": "Jami kabel uzunligini toping",
        "ru": "Найдите общую длину кабеля",
        "en": "Find the total cable length"
      }
    ],
    "question": {
      "uz": "Jami kabel uzunligi qancha?",
      "ru": "Какова общая длина кабеля?",
      "en": "What is the total cable length?"
    },
    "options": [
      {
        "uz": "4 m",
        "ru": "4 м",
        "en": "4 m"
      },
      {
        "uz": "5 m",
        "ru": "5 м",
        "en": "5 m"
      },
      {
        "uz": "5 m 85 cm",
        "ru": "5 м 85 см",
        "en": "5 m 85 cm"
      }
    ],
    "correctIndex": 1,
    "closedSet": true,
    "proof": {
      "uz": "175 + 240 + 85 = 500 cm = 5 m",
      "ru": "175 + 240 + 85 = 500 см = 5 м",
      "en": "175 + 240 + 85 = 500 cm = 5 m"
    },
    "feedbackAudio": [
      {
        "uz": "Yana bir qarang: Uchala bo'lak to'liq qo'shilmagan. Bir yuz yetmish besh, ikki yuz qirq va sakson besh santimetr jami besh yuz santimetr.",
        "ru": "Посмотрите ещё раз: Учтены не все три отрезка. Сто семьдесят пять, двести сорок и восемьдесят пять сантиметров дают пятьсот сантиметров.",
        "en": "Look again: Not all three pieces were included. One hundred and seventy five, two hundred and forty, and eighty five centimetres total five hundred centimetres."
      },
      {
        "uz": "To'g'ri. Bir yuz yetmish besh qo'shuv ikki yuz qirq qo'shuv sakson besh teng besh yuz santimetr teng besh metr.",
        "ru": "Верно. Сто семьдесят пять плюс двести сорок плюс восемьдесят пять равно пятьсот сантиметров равно пять метров.",
        "en": "Correct. One hundred and seventy five plus two hundred and forty plus eighty five equals five hundred centimetres equals five metres."
      },
      {
        "uz": "Yana bir qarang: Sakson besh santimetr jami besh yuz santimetr ichida allaqachon bor. Uni yana qoldirish shu bo'lakni ikki marta sanaydi.",
        "ru": "Посмотрите ещё раз: Восемьдесят пять сантиметров уже входят в общие пятьсот сантиметров. Если оставить их снова, этот отрезок будет посчитан дважды.",
        "en": "Look again: The eighty five centimetres is already included in the five hundred centimetre total. Keeping it again counts that piece twice."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Kabel bo'laklari bir metr yetmish besh santimetr, ikki metr qirq santimetr va sakson besh santimetr.",
          "Bir yuz yetmish besh, ikki yuz qirq va sakson besh santimetr yig'indisini toping.",
          "Jami kabel uzunligini toping."
        ],
        "ru": [
          "Отрезки кабеля имеют длину один метр семьдесят пять сантиметров, два метра сорок сантиметров и восемьдесят пять сантиметров.",
          "Найдите сумму ста семидесяти пяти, двухсот сорока и восьмидесяти пяти сантиметров.",
          "Найдите общую длину кабеля."
        ],
        "en": [
          "The cable pieces measure one metre seventy five centimetres, two metres forty centimetres, and eighty five centimetres.",
          "Find the sum of one hundred and seventy five, two hundred and forty, and eighty five centimetres.",
          "Find the total cable length."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Bir yuz yetmish besh qo'shuv ikki yuz qirq qo'shuv sakson besh teng besh yuz santimetr teng besh metr.",
        "ru": "Верно. Сто семьдесят пять плюс двести сорок плюс восемьдесят пять равно пятьсот сантиметров равно пять метров.",
        "en": "Correct. One hundred and seventy five plus two hundred and forty plus eighty five equals five hundred centimetres equals five metres."
      },
      "on_wrong": [
        {
          "uz": "Yana bir qarang: Uchala bo'lak to'liq qo'shilmagan. Bir yuz yetmish besh, ikki yuz qirq va sakson besh santimetr jami besh yuz santimetr.",
          "ru": "Посмотрите ещё раз: Учтены не все три отрезка. Сто семьдесят пять, двести сорок и восемьдесят пять сантиметров дают пятьсот сантиметров.",
          "en": "Look again: Not all three pieces were included. One hundred and seventy five, two hundred and forty, and eighty five centimetres total five hundred centimetres."
        },
        {
          "uz": "To'g'ri. Bir yuz yetmish besh qo'shuv ikki yuz qirq qo'shuv sakson besh teng besh yuz santimetr teng besh metr.",
          "ru": "Верно. Сто семьдесят пять плюс двести сорок плюс восемьдесят пять равно пятьсот сантиметров равно пять метров.",
          "en": "Correct. One hundred and seventy five plus two hundred and forty plus eighty five equals five hundred centimetres equals five metres."
        },
        {
          "uz": "Yana bir qarang: Sakson besh santimetr jami besh yuz santimetr ichida allaqachon bor. Uni yana qoldirish shu bo'lakni ikki marta sanaydi.",
          "ru": "Посмотрите ещё раз: Восемьдесят пять сантиметров уже входят в общие пятьсот сантиметров. Если оставить их снова, этот отрезок будет посчитан дважды.",
          "en": "Look again: The eighty five centimetres is already included in the five hundred centimetre total. Keeping it again counts that piece twice."
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
      "uz": "O'lchash masalalari navigatori",
      "ru": "Навигатор задач с величинами",
      "en": "Measurement problem navigator"
    },
    "scene": "measure-final",
    "frames": [
      {
        "uz": "Savol",
        "ru": "Вопрос",
        "en": "Question"
      },
      {
        "uz": "Umumiy birlik",
        "ru": "Общая единица",
        "en": "Common unit"
      },
      {
        "uz": "Model va amal",
        "ru": "Модель и действие",
        "en": "Model and operation"
      },
      {
        "uz": "Standart javob",
        "ru": "Стандартный ответ",
        "en": "Standard answer"
      },
      {
        "uz": "Keyingi mavzu: hajm",
        "ru": "Следующая тема: объём",
        "en": "Next topic: volume"
      }
    ],
    "rewardTitle": {
      "uz": "Kattaliklar masalasi eksperti",
      "ru": "Эксперт по задачам с величинами",
      "en": "Measures problem expert"
    },
    "audio": {
      "intro": {
        "uz": [
          "O'lchash masalalarida miqdor o'zgarmaydi faqat uni ifodalash va amallar ketma ketligi boshqariladi. Savol.",
          "Umumiy birlik",
          "Model va amal.",
          "Standart javob.",
          "Keyingi mavzu hajm."
        ],
        "ru": [
          "В задачах с величинами количество сохраняется меняются только запись и порядок действий. Вопрос.",
          "Общая единица",
          "Модель и действие.",
          "Стандартный ответ.",
          "Следующая тема объём."
        ],
        "en": [
          "In measurement problems the quantity is preserved only its notation and the operation sequence change. Question.",
          "Common unit",
          "Model and operation.",
          "Standard answer.",
          "Next topic volume."
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
export default function Grade4Dars31({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) { const preview = previewMode ?? (langProp === undefined || langProp === null); const initialLang = normalizeLang(langProp); const [previewLang, setPreviewLang] = useState(initialLang); const lang = preview ? normalizeLang(previewLang) : initialLang; configureLesson({ ttsApiBase: ttsApiBase || '', voiceGender: voiceGender || 'f', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', previewMode: preview }); const [current, setCurrent] = useState(0); const [answers, setAnswers] = useState([]); const [startedAt] = useState(() => Date.now()); const finished = useRef(false); const recordAnswer = useCallback((answer) => setAnswers((previous) => { const next = [...previous]; const old = previous[answer.screenIdx]; next[answer.screenIdx] = { ...answer, firstTry: old ? old.firstTry : answer.firstTry }; return next; }), []); const finishLesson = useCallback(() => { if (finished.current) return; finished.current = true; const scored = SCREEN_META.map((meta, index) => meta.scored ? index : null).filter((index) => index !== null); const firstTryCorrect = scored.filter((index) => answers[index]?.firstTry === true).length; const payload = { lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle[lang], studentName: studentName || null, durationSec: Math.floor((Date.now() - startedAt) / 1000), totalQuestions: scored.length, correctAnswers: firstTryCorrect, scorePercent: Math.round(firstTryCorrect / scored.length * 100), finalScore: firstTryCorrect, finalTotal: scored.length, passed: firstTryCorrect / scored.length >= 0.6, firstTryStats: { total: scored.length, firstTryCorrect }, attemptsTotal: scored.reduce((sum, index) => sum + (answers[index]?.attempts ?? 0), 0), skillTags: LESSON_META.skillTags, answers: answers.filter(Boolean) }; if (onFinished) onFinished(payload); else console.log('[Grade4 Dars31 preview]', payload); }, [answers, lang, onFinished, startedAt, studentName]); const Current = SCREENS[current]; return <LangContext.Provider value={lang}><style>{STYLES + TOPIC_STYLES}</style><div className={'lesson-root ' + (preview ? 'lesson-root-preview' : '')}>{preview && <div className="preview-language" aria-label={bi("Ko'rish tili", 'Язык предпросмотра', 'Preview language')[lang]}>{['uz', 'ru', 'en'].map((code) => <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} onPrev={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))} finishLesson={finishLesson}/></div></LangContext.Provider>; }

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
