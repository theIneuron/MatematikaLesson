import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// ============================================================================
// 4-SINF · Dars03 · Ko'p xonali sonning xona tarkibi
// Local fallback contract: SCREEN_META is the Notion-ready skeleton;
// CONTENT is the complete RU/UZ and audio package.
// ============================================================================

const T = {
  bg: '#F5F5F0',
  ink: '#12212C',
  ink2: '#50616D',
  ink3: '#87949D',
  paper: '#FFFFFF',
  accent: '#FF5B35',
  accentSoft: '#FFF0EA',
  cyan: '#168FA3',
  cyanSoft: '#E5F5F6',
  navy: '#173B52',
  lime: '#95C93D',
  success: '#227A53',
  successSoft: '#E7F3EC',
  warn: '#A96F13',
  warnSoft: '#FFF5D9',
  shadowBase: '58, 53, 48',
};

// Runtime and Notion share one index: CONTENT.sN, SCREEN_META[N], and
// SCREENS[N] describe the same screen. Dense theory screens keep their
// connected source ideas inside parts instead of becoming extra slides.
const CONTENT = {
  "s0": {
    "eyebrow": {
      "ru": "Новая миссия",
      "uz": "Yangi missiya"
    },
    "title": {
      "ru": "Бит дал трём четвёркам одно значение",
      "uz": "Bit uchta to'rtga bir xil qiymat berdi"
    },
    "lead": {
      "ru": "В коде 404 204 Бит увидел три одинаковые цифры и решил, что каждая означает просто 4. Датчик сообщает об ошибке.",
      "uz": "404 204 kodida Bit uchta bir xil raqamni ko'rdi va har biri faqat 4 ni bildiradi deb o'yladi. Sensor xato haqida xabar berdi."
    },
    "instruction": {
      "ru": "Какое действие нужно выполнить первым?",
      "uz": "Birinchi bo'lib qaysi harakatni bajarish kerak?"
    },
    "model": {
      "kind": "rows",
      "badge": {
        "ru": "Ошибка Бита",
        "uz": "Bitning xatosi"
      },
      "number": "404 204",
      "rows": [
        {
          "label": {
            "ru": "решение Бита",
            "uz": "Bitning yechimi"
          },
          "value": "4 = 4 = 4"
        }
      ]
    },
    "options": [
      {
        "ru": "Определить, в каком разряде стоит каждая цифра 4",
        "uz": "Har bir 4 raqami qaysi xonada turganini aniqlash"
      },
      {
        "ru": "Оставить всем трём цифрам значение 4",
        "uz": "Uchala raqamga ham 4 qiymatini qoldirish"
      },
      {
        "ru": "Сложить три цифры 4",
        "uz": "Uchta 4 raqamini qo'shish"
      },
      {
        "ru": "Удалить две повторяющиеся цифры",
        "uz": "Takrorlangan ikkita raqamni olib tashlash"
      }
    ],
    "correctIndex": 0,
    "correctText": {
      "ru": "Сначала нужно найти место каждой цифры. Только после этого можно определить её значение.",
      "uz": "Avval har bir raqamning o'rnini topish kerak. Shundan keyingina uning qiymatini aniqlash mumkin."
    },
    "wrong": [
      null,
      {
        "ru": "Так ошибка Бита сохранится: одинаковая цифра может стоять в разных разрядах. Сначала найди каждое место.",
        "uz": "Bunday qilsangiz Bitning xatosi qoladi, bir xil raqam turli xonalarda turishi mumkin. Avval har bir o'rinni toping."
      },
      {
        "ru": "Сумма цифр не показывает их вклад в число. Нужно определить разряд каждой цифры.",
        "uz": "Raqamlar yig'indisi ularning sondagi hissasini ko'rsatmaydi. Har bir raqamning xonasini aniqlash kerak."
      },
      {
        "ru": "Повторяющиеся цифры являются частью кода. Удаление изменит число и не исправит объяснение.",
        "uz": "Takrorlangan raqamlar kodning bir qismi. Ularni olib tashlash sonni o'zgartiradi va izohni tuzatmaydi."
      }
    ],
    "audio": {
      "intro": {
        "ru": [
          "Бит увидел в коде три цифры четыре и дал им одинаковое значение. Сенсор сообщает об ошибке.",
          "Выбери первое действие, которое поможет проверить решение Бита."
        ],
        "uz": [
          "Bit kodda uchta to'rt raqamini ko'rib, ularga bir xil qiymat berdi. Sensor xato haqida xabar beryapti.",
          "Bitning yechimini tekshirishga yordam beradigan birinchi harakatni tanlang."
        ]
      },
      "on_correct": {
        "ru": "Верно. Сначала определяем разряд каждой цифры.",
        "uz": "To'g'ri. Avval har bir raqamning xonasini aniqlaymiz."
      },
      "on_wrong": [
        null,
        {
          "ru": "Одинаковая цифра может занимать разные разряды. Сначала найди её места.",
          "uz": "Bir xil raqam turli xonalarni egallashi mumkin. Avval uning o'rinlarini toping."
        },
        {
          "ru": "Складывать цифры не нужно. Проверь место каждой четвёрки.",
          "uz": "Raqamlarni qo'shish kerak emas. Har bir to'rtning o'rnini tekshiring."
        },
        {
          "ru": "Цифры удалять нельзя. Они сохраняют исходный код.",
          "uz": "Raqamlarni olib tashlab bo'lmaydi. Ular dastlabki kodni saqlaydi."
        }
      ]
    }
  },
  "s1": {
    "parts": [
      {
        "eyebrow": {
          "ru": "Диагностика",
          "uz": "Diagnostika"
        },
        "title": {
          "ru": "Вспомни запись числа по голосу",
          "uz": "Sonni ovozdan yozishni eslang"
        },
        "lead": {
          "ru": "Это умение из прошлого урока поможет не потерять разряды.",
          "uz": "Oldingi darsdagi bu ko'nikma xonalarni yo'qotmaslikka yordam beradi."
        },
        "instruction": {
          "ru": "Как записать число триста восемнадцать тысяч сорок?",
          "uz": "Uch yuz o'n sakkiz ming qirq soni qanday yoziladi?"
        },
        "model": {
          "kind": "code",
          "badge": {
            "ru": "Голосовой код",
            "uz": "Ovozli kod"
          },
          "number": "□□□ □□□"
        },
        "options": [
          "318 040",
          "318 400",
          "310 840",
          "31 840"
        ],
        "correctIndex": 0,
        "correctText": {
          "ru": "318 040 записано двумя классами. Ноль сотен и ноль единиц сохранили свои места.",
          "uz": "318 040 ikkita sinf bilan yozildi. Nol yuzlik va nol birlik o'z o'rnini saqladi."
        },
        "wrong": [
          null,
          {
            "ru": "400 означает четыре сотни, а в условии названы сорок. Цифра 4 должна стоять в десятках.",
            "uz": "400 to'rt yuzni bildiradi, shartda esa qirq aytilgan. 4 raqami o'nlar xonasida turishi kerak."
          },
          {
            "ru": "Левая и правая группы смешались. Сначала запиши 318 тысяч, затем 040.",
            "uz": "Chap va o'ng guruhlar aralashgan. Avval 318 mingni, keyin 040 ni yozing."
          },
          {
            "ru": "Потерян разряд сотен тысяч. Для 318 тысяч нужна полная левая группа.",
            "uz": "Yuz minglar xonasi yo'qolgan. 318 ming uchun to'liq chap guruh kerak."
          }
        ],
        "audio": {
          "intro": {
            "ru": [
              "Запиши цифрами триста восемнадцать тысяч сорок. В классе единиц сохрани три места."
            ],
            "uz": [
              "Uch yuz o'n sakkiz ming qirq sonini raqamlar bilan yozing. Birlar sinfida uchta xonani saqlang."
            ]
          },
          "on_correct": {
            "ru": "Запись точная. Получилось триста восемнадцать тысяч сорок.",
            "uz": "Yozuv aniq. Uch yuz o'n sakkiz ming qirq hosil bo'ldi."
          },
          "on_wrong": [
            null,
            {
              "ru": "Сорок занимает десятки и единицы. Перед ним нужен ноль сотен.",
              "uz": "Qirq o'nlar va birliklarni egallaydi. Uning oldida nol yuzlik kerak."
            },
            {
              "ru": "Сохрани отдельно класс тысяч и класс единиц.",
              "uz": "Minglar sinfi va birlar sinfini alohida saqlang."
            },
            {
              "ru": "Верни сотни тысяч в левую группу.",
              "uz": "Yuz minglar xonasini chap guruhga qaytaring."
            }
          ]
        }
      },
      {
        "eyebrow": {
          "ru": "Прогноз",
          "uz": "Bashorat"
        },
        "title": {
          "ru": "Какая четвёрка весит больше?",
          "uz": "Qaysi to'rtning qiymati kattaroq?"
        },
        "lead": {
          "ru": "Правило ещё не готово. Сделай прогноз по месту цифры.",
          "uz": "Qoida hali tayyor emas. Raqam o'rniga qarab bashorat qiling."
        },
        "instruction": {
          "ru": "Какая цифра 4 в коде 404 204 имеет наибольшее значение?",
          "uz": "404 204 kodidagi qaysi 4 raqami eng katta qiymatga ega?"
        },
        "model": {
          "kind": "code",
          "badge": {
            "ru": "Три одинаковые цифры",
            "uz": "Uchta bir xil raqam"
          },
          "number": "404 204"
        },
        "options": [
          {
            "ru": "Левая цифра 4",
            "uz": "Chapdagi 4 raqami"
          },
          {
            "ru": "Средняя цифра 4",
            "uz": "O'rtadagi 4 raqami"
          },
          {
            "ru": "Правая цифра 4",
            "uz": "O'ngdagi 4 raqami"
          },
          {
            "ru": "Все три имеют одинаковое значение",
            "uz": "Uchalasining qiymati bir xil"
          }
        ],
        "correctIndex": 0,
        "correctText": {
          "ru": "Левая четвёрка стоит в самом старшем из трёх разрядов. Следующая модель покажет точные значения.",
          "uz": "Chapdagi to'rt uchalasining eng katta xonasida turibdi. Keyingi model aniq qiymatlarni ko'rsatadi."
        },
        "wrong": [
          null,
          {
            "ru": "Средняя четвёрка находится правее левой, поэтому занимает меньший разряд. Сравни их места.",
            "uz": "O'rtadagi to'rt chapdagidan o'ngda, shuning uchun kichikroq xonani egallaydi. Ularning o'rnini solishtiring."
          },
          {
            "ru": "Правая четвёрка стоит в единицах. Она занимает самый младший из трёх разрядов.",
            "uz": "O'ngdagi to'rt birliklar xonasida turibdi. U uchalasining eng kichik xonasini egallaydi."
          },
          {
            "ru": "Цифры одинаковы, но их места различаются. Значения нужно сравнивать по разрядам.",
            "uz": "Raqamlar bir xil, ammo ularning o'rinlari turlicha. Qiymatlarni xonalar bo'yicha solishtirish kerak."
          }
        ],
        "audio": {
          "intro": {
            "ru": [
              "В коде три одинаковые цифры четыре. Предположи, какая из них имеет наибольшее значение."
            ],
            "uz": [
              "Kodda uchta bir xil to'rt raqami bor. Ulardan qaysi biri eng katta qiymatga ega ekanini taxmin qiling."
            ]
          },
          "on_correct": {
            "ru": "Прогноз принят. Левая цифра занимает самый старший разряд.",
            "uz": "Bashorat qabul qilindi. Chapdagi raqam eng katta xonani egallaydi."
          },
          "on_wrong": [
            null,
            {
              "ru": "Средняя цифра находится правее левой. Сравни их разряды.",
              "uz": "O'rtadagi raqam chapdagidan o'ngda. Ularning xonalarini solishtiring."
            },
            {
              "ru": "Правая цифра стоит в единицах. Это самый младший разряд.",
              "uz": "O'ngdagi raqam birliklarda turibdi. Bu eng kichik xona."
            },
            {
              "ru": "Одинаковые цифры могут иметь разные значения. Их определяет место.",
              "uz": "Bir xil raqamlar turli qiymatlarga ega bo'lishi mumkin. Qiymatni o'rin belgilaydi."
            }
          ]
        }
      }
    ]
  },
  "s2": {
    "eyebrow": {
      "ru": "Лестница разрядов",
      "uz": "Xonalar zinasi"
    },
    "title": {
      "ru": "Один шаг влево увеличивает значение в 10 раз",
      "uz": "Chapga bir qadam qiymatni 10 marta oshiradi"
    },
    "lead": {
      "ru": "Цифра остаётся той же, но новое место делает её значение в десять раз больше.",
      "uz": "Raqam o'zgarmaydi, ammo yangi o'rin uning qiymatini o'n marta kattalashtiradi."
    },
    "instruction": {
      "ru": "Проследи путь одной цифры 6 от единиц до тысяч.",
      "uz": "Bitta 6 raqamining birlardan minglargacha yo'lini kuzating."
    },
    "direction": {
      "ru": "каждый шаг влево · × 10",
      "uz": "har bir qadam chapga · × 10"
    },
    "steps": [
      {
        "place": {
          "ru": "тысячи",
          "uz": "minglar"
        },
        "value": "6 000",
        "digit": "6"
      },
      {
        "place": {
          "ru": "сотни",
          "uz": "yuzlar"
        },
        "value": "600",
        "digit": "6"
      },
      {
        "place": {
          "ru": "десятки",
          "uz": "o'nlar"
        },
        "value": "60",
        "digit": "6"
      },
      {
        "place": {
          "ru": "единицы",
          "uz": "birlar"
        },
        "value": "6",
        "digit": "6"
      }
    ],
    "contrasts": [
      {
        "number": "406 052",
        "place": {
          "ru": "6 стоит в тысячах",
          "uz": "6 minglar xonasida"
        },
        "value": "6 000"
      },
      {
        "number": "460 052",
        "place": {
          "ru": "6 сдвинулась на одно место влево",
          "uz": "6 bir xona chapga siljidi"
        },
        "value": "60 000"
      }
    ],
    "conclusion": {
      "ru": "В 460 052 цифра 6 стала означать 60 000. Один сдвиг влево умножил её прежнее значение 6 000 на 10.",
      "uz": "460 052 sonida 6 raqami 60 000 ni bildirdi. Chapga bir siljish uning oldingi 6 000 qiymatini 10 ga ko'paytirdi."
    },
    "audio": {
      "ru": [
        "Проследим путь одной цифры шесть. В единицах она означает шесть, в десятках шестьдесят, в сотнях шестьсот, а в тысячах шесть тысяч.",
        "Каждый шаг влево сохраняет цифру, но увеличивает её значение в десять раз.",
        "В числе четыреста шесть тысяч пятьдесят два цифра шесть означает шесть тысяч. После сдвига влево в числе четыреста шестьдесят тысяч пятьдесят два она означает шестьдесят тысяч."
      ],
      "uz": [
        "Bitta olti raqamining yo'lini kuzatamiz. Birlarda u olti, o'nlarda oltmish, yuzlarda olti yuz, minglarda esa olti mingni bildiradi.",
        "Har bir chapga qadam raqamni saqlaydi, ammo uning qiymatini o'n marta oshiradi.",
        "To'rt yuz olti ming ellik ikki sonida olti raqami olti mingni bildiradi. Chapga siljigach, to'rt yuz oltmish ming ellik ikki sonida u oltmish mingni bildiradi."
      ]
    }
  },
  "s3": {
    "parts": [
      {
        "eyebrow": {
          "ru": "Первая модель",
          "uz": "Birinchi model"
        },
        "title": {
          "ru": "Таблица раскрыла три значения",
          "uz": "Jadval uchta qiymatni ochdi"
        },
        "lead": {
          "ru": "Теперь каждую цифру можно связать с её разрядом.",
          "uz": "Endi har bir raqamni uning xonasi bilan bog'lash mumkin."
        },
        "instruction": {
          "ru": "Какие значения имеют три цифры 4 слева направо?",
          "uz": "Uchta 4 raqami chapdan o'ngga qanday qiymatlarga ega?"
        },
        "model": {
          "kind": "table",
          "badge": {
            "ru": "Разрядная таблица",
            "uz": "Xona jadvali"
          },
          "number": "404 204",
          "columns": [
            {
              "label": {
                "ru": "сотни тысяч",
                "uz": "yuz minglar"
              },
              "value": "4"
            },
            {
              "label": {
                "ru": "десятки тысяч",
                "uz": "o'n minglar"
              },
              "value": "0"
            },
            {
              "label": {
                "ru": "тысячи",
                "uz": "minglar"
              },
              "value": "4"
            },
            {
              "label": {
                "ru": "сотни",
                "uz": "yuzlar"
              },
              "value": "2"
            },
            {
              "label": {
                "ru": "десятки",
                "uz": "o'nlar"
              },
              "value": "0"
            },
            {
              "label": {
                "ru": "единицы",
                "uz": "birlar"
              },
              "value": "4"
            }
          ]
        },
        "options": [
          "400 000; 4 000; 4",
          "4; 4; 4",
          "40 000; 400; 4",
          "400 000; 40 000; 400"
        ],
        "correctIndex": 0,
        "correctText": {
          "ru": "Слева направо четвёрки обозначают 400 000, 4 000 и 4. Место каждой цифры определило её значение.",
          "uz": "Chapdan o'ngga to'rtlar 400 000, 4 000 va 4 ni bildiradi. Har bir raqamning o'rni uning qiymatini belgiladi."
        },
        "wrong": [
          null,
          {
            "ru": "Это повторяет ошибку Бита и учитывает только цифры. Добавь значение каждого разряда.",
            "uz": "Bu Bitning xatosini takrorlaydi va faqat raqamlarni hisobga oladi. Har bir xona qiymatini qo'shing."
          },
          {
            "ru": "Средняя четвёрка стоит в тысячах, а не в сотнях. Левая стоит в сотнях тысяч.",
            "uz": "O'rtadagi to'rt yuzlarda emas, minglarda turibdi. Chapdagisi yuz minglarda."
          },
          {
            "ru": "В этом варианте все три цифры сдвинуты в другие разряды. Читай заголовки их столбцов.",
            "uz": "Bu variantda uchala raqam boshqa xonalarga siljigan. Ularning ustun nomlarini o'qing."
          }
        ],
        "audio": {
          "intro": {
            "ru": [
              "Разрядная таблица показывает места трёх цифр четыре. Выбери их значения слева направо."
            ],
            "uz": [
              "Xona jadvali uchta to'rt raqamining o'rnini ko'rsatadi. Ularning qiymatlarini chapdan o'ngga tanlang."
            ]
          },
          "on_correct": {
            "ru": "Теперь ошибка Бита понятна. Одинаковые цифры получили три разных разрядных значения.",
            "uz": "Endi Bitning xatosi aniq. Bir xil raqamlar uch xil xona qiymatini oldi."
          },
          "on_wrong": [
            null,
            {
              "ru": "Нужно учесть не только цифры, но и их разряды.",
              "uz": "Faqat raqamlarni emas, ularning xonalarini ham hisobga olish kerak."
            },
            {
              "ru": "Средняя четвёрка стоит в тысячах. Проверь левую четвёрку.",
              "uz": "O'rtadagi to'rt minglarda turibdi. Chapdagi to'rtni tekshiring."
            },
            {
              "ru": "Сопоставь каждую четвёрку с заголовком её столбца.",
              "uz": "Har bir to'rtni uning ustuni nomi bilan moslang."
            }
          ]
        }
      },
      {
        "eyebrow": {
          "ru": "Вторая модель",
          "uz": "Ikkinchi model"
        },
        "title": {
          "ru": "Переводим таблицу в сумму",
          "uz": "Jadvalni yig'indiga aylantiramiz"
        },
        "lead": {
          "ru": "Разрядные значения становятся слагаемыми развёрнутой записи.",
          "uz": "Xona qiymatlari yoyiq yozuvning qo'shiluvchilariga aylanadi."
        },
        "instruction": {
          "ru": "Какое слагаемое пропущено в разложении числа 404 204?",
          "uz": "404 204 sonining yoyiq yozuvida qaysi qo'shiluvchi tushib qolgan?"
        },
        "model": {
          "kind": "rows",
          "badge": {
            "ru": "Неполное разложение",
            "uz": "Tugallanmagan yoyiq yozuv"
          },
          "number": "404 204",
          "rows": [
            {
              "label": {
                "ru": "развёрнутая запись",
                "uz": "yoyiq yozuv"
              },
              "value": "400 000 + □ + 200 + 4"
            },
            {
              "label": {
                "ru": "средняя цифра 4",
                "uz": "o'rtadagi 4 raqami"
              },
              "value": {
                "ru": "тысячи",
                "uz": "minglar"
              }
            }
          ]
        },
        "options": [
          "4 000",
          "40 000",
          "400",
          "4"
        ],
        "correctIndex": 0,
        "correctText": {
          "ru": "Средняя цифра 4 стоит в тысячах, поэтому пропущено слагаемое 4 000.",
          "uz": "O'rtadagi 4 raqami minglar xonasida, shuning uchun 4 000 qo'shiluvchisi tushib qolgan."
        },
        "wrong": [
          null,
          {
            "ru": "40 000 относится к десяткам тысяч, где в числе стоит ноль. Нужны единицы тысяч.",
            "uz": "40 000 o'n minglar xonasiga tegishli, sonda u yerda nol turibdi. Minglar birligi kerak."
          },
          {
            "ru": "400 относится к сотням, где уже стоит цифра 2. Четвёрка находится левее.",
            "uz": "400 yuzlar xonasiga tegishli, u yerda 2 raqami turibdi. To'rt undan chapda."
          },
          {
            "ru": "Это значение правой четвёрки в единицах. Пропущена средняя цифра в тысячах.",
            "uz": "Bu o'ngdagi to'rtning birliklardagi qiymati. Minglardagi o'rtadagi raqam tushib qolgan."
          }
        ],
        "audio": {
          "intro": {
            "ru": [
              "Число четыреста четыре тысячи двести четыре начали раскладывать на разрядные слагаемые. Найди пропущенное значение средней четвёрки."
            ],
            "uz": [
              "To'rt yuz to'rt ming ikki yuz to'rt soni xona qo'shiluvchilariga ajratila boshlandi. O'rtadagi to'rtning tushib qolgan qiymatini toping."
            ]
          },
          "on_correct": {
            "ru": "Верно. Средняя четвёрка в тысячах даёт четыре тысячи.",
            "uz": "To'g'ri. Minglardagi o'rtadagi to'rt to'rt mingni beradi."
          },
          "on_wrong": [
            null,
            {
              "ru": "Десятки тысяч заняты нулём. Нужны четыре тысячи.",
              "uz": "O'n minglar xonasida nol turibdi. To'rt ming kerak."
            },
            {
              "ru": "Сотни заняты цифрой два. Четвёрка стоит в тысячах.",
              "uz": "Yuzlar xonasida ikki turibdi. To'rt minglar xonasida."
            },
            {
              "ru": "Единицы уже представлены последним слагаемым. Найди значение средней четвёрки.",
              "uz": "Birliklar oxirgi qo'shiluvchida berilgan. O'rtadagi to'rtning qiymatini toping."
            }
          ]
        }
      }
    ]
  },
  "s4": {
    "parts": [
      {
        "eyebrow": {
          "ru": "Действие с моделью",
          "uz": "Model bilan harakat"
        },
        "title": {
          "ru": "Запиши значение цифры",
          "uz": "Raqamning qiymatini yozing"
        },
        "lead": {
          "ru": "Таблица оставляет одну задачу: превратить место цифры в её значение.",
          "uz": "Jadval bitta vazifani qoldiradi: raqam o'rnini uning qiymatiga aylantirish."
        },
        "instruction": {
          "ru": "Чему равна цифра 6 в числе 306 052?",
          "uz": "306 052 sonidagi 6 raqamining qiymati qancha?"
        },
        "model": {
          "kind": "table",
          "badge": {
            "ru": "Найди столбец",
            "uz": "Ustunni toping"
          },
          "number": "306 052",
          "columns": [
            {
              "label": {
                "ru": "сотни тысяч",
                "uz": "yuz minglar"
              },
              "value": "3"
            },
            {
              "label": {
                "ru": "десятки тысяч",
                "uz": "o'n minglar"
              },
              "value": "0"
            },
            {
              "label": {
                "ru": "тысячи",
                "uz": "minglar"
              },
              "value": "6"
            },
            {
              "label": {
                "ru": "сотни",
                "uz": "yuzlar"
              },
              "value": "0"
            },
            {
              "label": {
                "ru": "десятки",
                "uz": "o'nlar"
              },
              "value": "5"
            },
            {
              "label": {
                "ru": "единицы",
                "uz": "birlar"
              },
              "value": "2"
            }
          ]
        },
        "placeholder": {
          "ru": "0",
          "uz": "0"
        },
        "correctValue": "6000",
        "correctText": {
          "ru": "Цифра 6 стоит в тысячах, поэтому её значение равно 6 000.",
          "uz": "6 raqami minglar xonasida, shuning uchun uning qiymati 6 000."
        },
        "wrongText": {
          "ru": "Сначала найди столбец цифры 6. Она стоит в тысячах, поэтому в значении нужны три нуля.",
          "uz": "Avval 6 raqamining ustunini toping. U minglar xonasida, shuning uchun qiymatda uchta nol kerak."
        },
        "wrongByValue": {
          "6": {
            "ru": "Записана только цифра 6. Добавь значение разряда тысяч.",
            "uz": "Faqat 6 raqami yozildi. Minglar xonasi qiymatini qo'shing."
          },
          "600": {
            "ru": "600 относится к сотням. Цифра 6 стоит на одно место левее.",
            "uz": "600 yuzlar xonasiga tegishli. 6 raqami undan bir xona chapda."
          },
          "60000": {
            "ru": "60 000 относится к десяткам тысяч. Цифра 6 стоит на одно место правее.",
            "uz": "60 000 o'n minglar xonasiga tegishli. 6 raqami undan bir xona o'ngda."
          }
        },
        "inputWrongAudio": {
          "ru": "Проверь разряд цифры шесть и количество нулей в её значении.",
          "uz": "Olti raqamining xonasini va uning qiymatidagi nollar sonini tekshiring."
        },
        "audio": {
          "intro": {
            "ru": [
              "Введи значение цифры шесть в числе триста шесть тысяч пятьдесят два."
            ],
            "uz": [
              "Uch yuz olti ming ellik ikki sonidagi olti raqamining qiymatini kiriting."
            ]
          },
          "on_correct": {
            "ru": "Верно. Цифра шесть в тысячах имеет значение шесть тысяч.",
            "uz": "To'g'ri. Minglar xonasidagi olti raqami olti ming qiymatga ega."
          },
          "on_wrong": {
            "ru": "Проверь разряд цифры шесть и количество нулей в её значении.",
            "uz": "Olti raqamining xonasini va uning qiymatidagi nollar sonini tekshiring."
          }
        }
      },
      {
        "eyebrow": {
          "ru": "Вместе",
          "uz": "Birgalikda"
        },
        "title": {
          "ru": "Разложи число полностью",
          "uz": "Sonni to'liq yoying"
        },
        "lead": {
          "ru": "Нулевые слагаемые можно не писать, но их места нельзя сдвигать.",
          "uz": "Nol qo'shiluvchilarni yozmaslik mumkin, ammo ularning o'rnini siljitib bo'lmaydi."
        },
        "instruction": {
          "ru": "Какая сумма точно показывает состав числа 581 240?",
          "uz": "Qaysi yig'indi 581 240 sonining tarkibini aniq ko'rsatadi?"
        },
        "model": {
          "kind": "code",
          "badge": {
            "ru": "Число для разложения",
            "uz": "Yoyiladigan son"
          },
          "number": "581 240"
        },
        "options": [
          "500 000 + 80 000 + 1 000 + 200 + 40",
          "500 000 + 8 000 + 1 000 + 200 + 40",
          "500 000 + 80 000 + 100 + 20 + 4",
          "58 000 + 1 000 + 240"
        ],
        "correctIndex": 0,
        "correctText": {
          "ru": "Каждая ненулевая цифра получила своё разрядное значение. Ноль единиц не требует отдельного слагаемого.",
          "uz": "Har bir noldan farqli raqam o'z xona qiymatini oldi. Nol birlik uchun alohida qo'shiluvchi kerak emas."
        },
        "wrong": [
          null,
          {
            "ru": "Цифра 8 стоит в десятках тысяч, а не в тысячах. Её значение равно 80 000.",
            "uz": "8 raqami minglarda emas, o'n minglar xonasida turibdi. Uning qiymati 80 000."
          },
          {
            "ru": "В этой сумме цифры 1, 2 и 4 сдвинуты вправо. Сохрани их исходные разряды.",
            "uz": "Bu yig'indida 1, 2 va 4 raqamlari o'ngga siljigan. Ularning dastlabki xonalarini saqlang."
          },
          {
            "ru": "Первое слагаемое потеряло разряд сотен тысяч. Разлагай каждую цифру отдельно.",
            "uz": "Birinchi qo'shiluvchi yuz minglar xonasini yo'qotgan. Har bir raqamni alohida yoying."
          }
        ],
        "audio": {
          "intro": {
            "ru": [
              "Выбери полное разложение числа пятьсот восемьдесят одна тысяча двести сорок."
            ],
            "uz": [
              "Besh yuz sakson bir ming ikki yuz qirq sonining to'liq yoyiq yozuvini tanlang."
            ]
          },
          "on_correct": {
            "ru": "Точно. Пять разрядных слагаемых сохраняют все ненулевые цифры.",
            "uz": "Aniq. Beshta xona qo'shiluvchisi barcha noldan farqli raqamlarni saqlaydi."
          },
          "on_wrong": [
            null,
            {
              "ru": "Цифра восемь обозначает десятки тысяч. Увеличь это слагаемое.",
              "uz": "Sakkiz raqami o'n minglarni bildiradi. Bu qo'shiluvchini kattalashtiring."
            },
            {
              "ru": "Последние цифры сдвинулись вправо. Верни их в исходные разряды.",
              "uz": "Oxirgi raqamlar o'ngga siljigan. Ularni dastlabki xonalarga qaytaring."
            },
            {
              "ru": "Сотни тысяч нельзя заменить десятками тысяч. Разложи каждую цифру.",
              "uz": "Yuz minglarni o'n minglar bilan almashtirib bo'lmaydi. Har bir raqamni yoying."
            }
          ]
        }
      }
    ]
  },
  "s5": {
    "eyebrow": {
      "ru": "Нулевой разряд",
      "uz": "Nol qiymatli xona"
    },
    "title": {
      "ru": "В сумме ноль можно опустить, в числе — нельзя",
      "uz": "Yig'indida nolni yozmaslik mumkin, sonda esa mumkin emas"
    },
    "lead": {
      "ru": "Ноль играет две разные роли: не меняет сумму и одновременно удерживает место цифр в обычной записи.",
      "uz": "Nol ikki xil vazifani bajaradi: yig'indini o'zgartirmaydi va odatiy yozuvda raqamlar o'rnini saqlaydi."
    },
    "instruction": {
      "ru": "Сравни два контраста на числе 530 407.",
      "uz": "530 407 sonidagi ikki qarama-qarshi holatni solishtiring."
    },
    "number": "530 407",
    "places": [
      {
        "label": {
          "ru": "сотни тысяч",
          "uz": "yuz minglar"
        },
        "digit": "5"
      },
      {
        "label": {
          "ru": "десятки тысяч",
          "uz": "o'n minglar"
        },
        "digit": "3"
      },
      {
        "label": {
          "ru": "тысячи",
          "uz": "minglar"
        },
        "digit": "0",
        "zero": true
      },
      {
        "label": {
          "ru": "сотни",
          "uz": "yuzlar"
        },
        "digit": "4"
      },
      {
        "label": {
          "ru": "десятки",
          "uz": "o'nlar"
        },
        "digit": "0",
        "zero": true
      },
      {
        "label": {
          "ru": "единицы",
          "uz": "birlar"
        },
        "digit": "7"
      }
    ],
    "sumWithZeros": "500 000 + 30 000 + 0 + 400 + 0 + 7",
    "sumCompact": "500 000 + 30 000 + 400 + 7",
    "brokenNumber": "53 407",
    "sumLabel": {
      "ru": "СУММА НЕ ИЗМЕНИЛАСЬ",
      "uz": "YIG'INDI O'ZGARMADI"
    },
    "sumExplanation": {
      "ru": "Нулевые слагаемые можно убрать: прибавление нуля не меняет результат.",
      "uz": "Nol qo'shiluvchilarni olib tashlash mumkin, chunki nol qo'shish natijani o'zgartirmaydi."
    },
    "notationLabel": {
      "ru": "ЧИСЛО ИЗМЕНИЛОСЬ",
      "uz": "SON O'ZGARDI"
    },
    "notationExplanation": {
      "ru": "Если убрать ноль тысяч из 530 407, получится 53 407. Все цифры слева займут другие разряды.",
      "uz": "530 407 sonidan minglar xonasidagi nol olib tashlansa, 53 407 hosil bo'ladi. Chapdagi raqamlar boshqa xonalarni egallaydi."
    },
    "conclusion": {
      "ru": "Коэффициент нулевого разряда не пишем отдельным слагаемым, но сам разряд в обычной записи обязательно сохраняем нулём.",
      "uz": "Nol qiymatli xona uchun alohida qo'shiluvchi yozmaymiz, ammo odatiy yozuvda shu xonani nol bilan albatta saqlaymiz."
    },
    "audio": {
      "ru": [
        "В числе пятьсот тридцать тысяч четыреста семь пусты разряды тысяч и десятков.",
        "В развёрнутой сумме нулевые слагаемые можно не писать, потому что прибавление нуля не меняет результат.",
        "В обычной записи нули удалять нельзя. Без нуля тысяч получится уже пятьдесят три тысячи четыреста семь, то есть другое число."
      ],
      "uz": [
        "Besh yuz o'ttiz ming to'rt yuz yetti sonida minglar va o'nlar xonalari bo'sh.",
        "Yoyiq yig'indida nol qo'shiluvchilarni yozmaslik mumkin, chunki nol qo'shish natijani o'zgartirmaydi.",
        "Odatiy yozuvdagi nollarni olib tashlab bo'lmaydi. Minglar xonasidagi nolsiz ellik uch ming to'rt yuz yetti, ya'ni boshqa son hosil bo'ladi."
      ]
    }
  },
  "s6": {
    "parts": [
      {
        "eyebrow": {
          "ru": "Открытие",
          "uz": "Kashfiyot"
        },
        "title": {
          "ru": "Нулевое слагаемое не пишем, место сохраняем",
          "uz": "Nol qo'shiluvchini yozmaymiz, o'rnini saqlaymiz"
        },
        "lead": {
          "ru": "Сравни обычную и развёрнутую записи числа 462 305.",
          "uz": "462 305 sonining odatiy va yoyiq yozuvlarini solishtiring."
        },
        "instruction": {
          "ru": "Какой вывод объясняет обе записи?",
          "uz": "Qaysi xulosa ikkala yozuvni tushuntiradi?"
        },
        "model": {
          "kind": "rows",
          "badge": {
            "ru": "Две формы одного числа",
            "uz": "Bitta sonning ikki ko'rinishi"
          },
          "number": "462 305",
          "rows": [
            {
              "label": {
                "ru": "обычная запись",
                "uz": "odatiy yozuv"
              },
              "value": "462 305"
            },
            {
              "label": {
                "ru": "развёрнутая запись",
                "uz": "yoyiq yozuv"
              },
              "value": "400 000 + 60 000 + 2 000 + 300 + 5"
            },
            {
              "label": {
                "ru": "разряд десятков",
                "uz": "o'nlar xonasi"
              },
              "value": "0"
            }
          ]
        },
        "options": [
          {
            "ru": "Слагаемое 0 можно не писать, но ноль в числе сохраняет разряд десятков",
            "uz": "0 qo'shiluvchini yozmaslik mumkin, ammo sondagi nol o'nlar xonasini saqlaydi"
          },
          {
            "ru": "Ноль нужно удалить и из обычной записи",
            "uz": "Nolni odatiy yozuvdan ham olib tashlash kerak"
          },
          {
            "ru": "В развёрнутой записи обязательно писать + 0",
            "uz": "Yoyiq yozuvda + 0 ni albatta yozish kerak"
          },
          {
            "ru": "Ноль означает, что число заканчивается на сотнях",
            "uz": "Nol son yuzlar xonasida tugashini bildiradi"
          }
        ],
        "correctIndex": 0,
        "correctText": {
          "ru": "Нулевое разрядное слагаемое не меняет сумму, поэтому его опускают. В записи 462 305 ноль остаётся и удерживает десятки.",
          "uz": "Nol xona qo'shiluvchisi yig'indini o'zgartirmaydi, shuning uchun yozilmaydi. 462 305 yozuvida nol qolib, o'nlar xonasini saqlaydi."
        },
        "wrong": [
          null,
          {
            "ru": "Без нуля получится 46 235, и цифры справа сдвинутся. В обычной записи пустой разряд нужно сохранить.",
            "uz": "Nolsiz 46 235 hosil bo'lib, o'ngdagi raqamlar siljiydi. Odatiy yozuvda bo'sh xonani saqlash kerak."
          },
          {
            "ru": "Добавить 0 можно, но это лишнее слагаемое: сумма не изменится. Развёрнутая запись остаётся полной и без него.",
            "uz": "0 ni qo'shish mumkin, ammo bu ortiqcha qo'shiluvchi, yig'indi o'zgarmaydi. Yoyiq yozuv usiz ham to'liq."
          },
          {
            "ru": "После нуля есть цифра 5 в единицах. Число не заканчивается в разряде сотен.",
            "uz": "Noldan keyin birliklar xonasida 5 raqami bor. Son yuzlar xonasida tugamaydi."
          }
        ],
        "audio": {
          "intro": {
            "ru": [
              "Сравни обычную и развёрнутую записи числа четыреста шестьдесят две тысячи триста пять. Обрати внимание на пустые десятки."
            ],
            "uz": [
              "To'rt yuz oltmish ikki ming uch yuz besh sonining odatiy va yoyiq yozuvlarini solishtiring. Bo'sh o'nlarga e'tibor bering."
            ]
          },
          "on_correct": {
            "ru": "Открытие верно. Нулевое слагаемое опускаем, а ноль в обычной записи сохраняем.",
            "uz": "Kashfiyot to'g'ri. Nol qo'shiluvchini yozmaymiz, odatiy yozuvdagi nolni esa saqlaymiz."
          },
          "on_wrong": [
            null,
            {
              "ru": "Ноль в обычной записи удерживает десятки. Его удалять нельзя.",
              "uz": "Odatiy yozuvdagi nol o'nlar xonasini saqlaydi. Uni olib tashlab bo'lmaydi."
            },
            {
              "ru": "Нулевое слагаемое можно не писать, потому что оно не меняет сумму.",
              "uz": "Nol qo'shiluvchini yozmaslik mumkin, chunki u yig'indini o'zgartirmaydi."
            },
            {
              "ru": "Проверь цифру пять в единицах. Запись продолжается после сотен.",
              "uz": "Birliklar xonasidagi besh raqamini tekshiring. Yozuv yuzlardan keyin davom etadi."
            }
          ]
        }
      },
      {
        "eyebrow": {
          "ru": "Самостоятельно",
          "uz": "Mustaqil"
        },
        "title": {
          "ru": "Собери код без таблицы",
          "uz": "Kodni jadvalsiz yig'ing"
        },
        "lead": {
          "ru": "Теперь разряды нужно удержать мысленно.",
          "uz": "Endi xonalarni fikran saqlash kerak."
        },
        "instruction": {
          "ru": "Введи число: 900 000 + 3 000 + 70.",
          "uz": "Sonni kiriting: 900 000 + 3 000 + 70."
        },
        "model": {
          "kind": "rows",
          "badge": {
            "ru": "Разрядные значения",
            "uz": "Xona qiymatlari"
          },
          "rows": [
            {
              "label": {
                "ru": "сотни тысяч",
                "uz": "yuz minglar"
              },
              "value": "900 000"
            },
            {
              "label": {
                "ru": "тысячи",
                "uz": "minglar"
              },
              "value": "3 000"
            },
            {
              "label": {
                "ru": "десятки",
                "uz": "o'nlar"
              },
              "value": "70"
            }
          ]
        },
        "placeholder": {
          "ru": "0",
          "uz": "0"
        },
        "correctValue": "903070",
        "correctText": {
          "ru": "Код 903 070 восстановлен. Нули сохранили десятки тысяч, сотни и единицы.",
          "uz": "903 070 kodi tiklandi. Nollar o'n minglar, yuzlar va birlar xonalarini saqladi."
        },
        "wrongText": {
          "ru": "Проверь все шесть мест слева направо. Для отсутствующих значений запиши нули.",
          "uz": "Chapdan o'ngga oltita o'rinni tekshiring. Yo'q qiymatlar uchun nollarni yozing."
        },
        "wrongByValue": {
          "90370": {
            "ru": "Пропущен пустой разряд десятков тысяч. Число должно иметь шесть цифр.",
            "uz": "Bo'sh o'n minglar xonasi tushib qolgan. Son oltita raqamdan iborat bo'lishi kerak."
          },
          "903700": {
            "ru": "Значение 70 сдвинуто в сотни. Оно должно занять десятки.",
            "uz": "70 qiymati yuzlar xonasiga siljigan. U o'nlar xonasini egallashi kerak."
          },
          "930070": {
            "ru": "Цифра 3 поставлена в десятки тысяч. Значение 3 000 относится к тысячам.",
            "uz": "3 raqami o'n minglar xonasiga qo'yilgan. 3 000 qiymati minglarga tegishli."
          }
        },
        "inputWrongAudio": {
          "ru": "Проверь места тысяч и десятков. Пустые разряды отметь нулями.",
          "uz": "Minglar va o'nlar o'rnini tekshiring. Bo'sh xonalarni nollar bilan belgilang."
        },
        "audio": {
          "intro": {
            "ru": [
              "Самостоятельно восстанови число из девятисот тысяч, трёх тысяч и семидесяти."
            ],
            "uz": [
              "To'qqiz yuz ming, uch ming va yetmish qiymatlaridan sonni mustaqil tiklang."
            ]
          },
          "on_correct": {
            "ru": "Запись точная. Получилось девятьсот три тысячи семьдесят.",
            "uz": "Yozuv aniq. To'qqiz yuz uch ming yetmish hosil bo'ldi."
          },
          "on_wrong": {
            "ru": "Проверь места тысяч и десятков. Пустые разряды отметь нулями.",
            "uz": "Minglar va o'nlar o'rnini tekshiring. Bo'sh xonalarni nollar bilan belgilang."
          }
        }
      }
    ]
  },
  "s7": {
    "eyebrow": {
      "ru": "Собираем правило",
      "uz": "Qoidani yig'amiz"
    },
    "title": {
      "ru": "От цифры к разложению",
      "uz": "Raqamdan yoyiq yozuvgacha"
    },
    "lead": {
      "ru": "Теперь можно собрать правило из найденных действий.",
      "uz": "Endi topilgan harakatlardan qoidani yig'ish mumkin."
    },
    "instruction": {
      "ru": "Какой алгоритм работает и для разложения, и для восстановления числа?",
      "uz": "Qaysi algoritm sonni yoyish va tiklash uchun ham ishlaydi?"
    },
    "model": {
      "kind": "steps",
      "badge": {
        "ru": "Алгоритм",
        "uz": "Algoritm"
      },
      "steps": [
        {
          "ru": "1. Назвать цифру и её разряд",
          "uz": "1. Raqam va uning xonasini aytish"
        },
        {
          "ru": "2. Определить разрядное значение",
          "uz": "2. Xona qiymatini aniqlash"
        },
        {
          "ru": "3. Сложить значения или заполнить разряды",
          "uz": "3. Qiymatlarni qo'shish yoki xonalarni to'ldirish"
        }
      ]
    },
    "options": [
      {
        "ru": "Определить место каждой цифры, записать её значение и сохранить пустые разряды нулями",
        "uz": "Har bir raqam o'rnini aniqlash, qiymatini yozish va bo'sh xonalarni nollar bilan saqlash"
      },
      {
        "ru": "Выписать только ненулевые цифры подряд",
        "uz": "Faqat noldan farqli raqamlarni ketma-ket yozish"
      },
      {
        "ru": "Сложить названия всех разрядов",
        "uz": "Barcha xonalar nomini qo'shish"
      },
      {
        "ru": "Определять значение по соседней цифре",
        "uz": "Qiymatni qo'shni raqam orqali aniqlash"
      }
    ],
    "correctIndex": 0,
    "correctText": {
      "ru": "Алгоритм связывает цифру, разряд и значение. Нули при восстановлении удерживают пустые места.",
      "uz": "Algoritm raqam, xona va qiymatni bog'laydi. Tiklashda nollar bo'sh o'rinlarni saqlaydi."
    },
    "wrong": [
      null,
      {
        "ru": "Так пустые разряды исчезнут и остальные цифры сдвинутся. Нули нужно сохранить.",
        "uz": "Bunday qilsangiz bo'sh xonalar yo'qolib, boshqa raqamlar siljiydi. Nollarni saqlash kerak."
      },
      {
        "ru": "Названия разрядов не являются числами для сложения. Складывают разрядные значения цифр.",
        "uz": "Xona nomlari qo'shiladigan sonlar emas. Raqamlarning xona qiymatlari qo'shiladi."
      },
      {
        "ru": "Соседняя цифра не задаёт значение. Его определяет место цифры.",
        "uz": "Qo'shni raqam qiymatni belgilamaydi. Uni raqamning o'rni belgilaydi."
      }
    ],
    "audio": {
      "intro": {
        "ru": [
          "Собери правило, которое помогает разложить число и восстановить его из разрядных значений."
        ],
        "uz": [
          "Sonni yoyish va xona qiymatlaridan tiklashga yordam beradigan qoidani yig'ing."
        ]
      },
      "on_correct": {
        "ru": "Правило полное. Сначала место, затем значение, после этого сумма или запись числа.",
        "uz": "Qoida to'liq. Avval o'rin, keyin qiymat, undan so'ng yig'indi yoki son yozuvi."
      },
      "on_wrong": [
        null,
        {
          "ru": "Ненулевых цифр недостаточно. Пустые разряды тоже нужно сохранить.",
          "uz": "Noldan farqli raqamlarning o'zi yetarli emas. Bo'sh xonalarni ham saqlash kerak."
        },
        {
          "ru": "Складывают значения цифр, а не названия разрядов.",
          "uz": "Xona nomlari emas, raqamlarning qiymatlari qo'shiladi."
        },
        {
          "ru": "Ищи значение по месту цифры, а не по соседу.",
          "uz": "Qiymatni qo'shni raqamdan emas, raqam o'rnidan toping."
        }
      ]
    }
  },
  "s8": {
    "eyebrow": {
      "ru": "Меньше подсказок",
      "uz": "Kamroq yordam"
    },
    "title": {
      "ru": "Восстанови число по значениям",
      "uz": "Sonni qiymatlardan tiklang"
    },
    "lead": {
      "ru": "Пустые десятки тысяч и сотни нужно обозначить нулями.",
      "uz": "Bo'sh o'n minglar va yuzlar xonalarini nollar bilan belgilash kerak."
    },
    "instruction": {
      "ru": "Введи число: 700 000 + 9 000 + 50 + 3.",
      "uz": "Sonni kiriting: 700 000 + 9 000 + 50 + 3."
    },
    "model": {
      "kind": "rows",
      "badge": {
        "ru": "Карточки значений",
        "uz": "Qiymat kartalari"
      },
      "rows": [
        {
          "label": {
            "ru": "сотни тысяч",
            "uz": "yuz minglar"
          },
          "value": "700 000"
        },
        {
          "label": {
            "ru": "тысячи",
            "uz": "minglar"
          },
          "value": "9 000"
        },
        {
          "label": {
            "ru": "десятки",
            "uz": "o'nlar"
          },
          "value": "50"
        },
        {
          "label": {
            "ru": "единицы",
            "uz": "birlar"
          },
          "value": "3"
        }
      ]
    },
    "placeholder": {
      "ru": "0",
      "uz": "0"
    },
    "correctValue": "709053",
    "correctText": {
      "ru": "Получилось 709 053. Нули сохранили пустые десятки тысяч и сотни.",
      "uz": "709 053 hosil bo'ldi. Nollar bo'sh o'n minglar va yuzlar xonalarini saqladi."
    },
    "wrongText": {
      "ru": "Размести каждую карточку в своём разряде. Пустые разряды заполни нулями.",
      "uz": "Har bir kartani o'z xonasiga joylashtiring. Bo'sh xonalarni nollar bilan to'ldiring."
    },
    "wrongByValue": {
      "7953": {
        "ru": "Пропущены два пустых разряда. Число должно занимать шесть мест.",
        "uz": "Ikkita bo'sh xona tushib qolgan. Son oltita o'rinni egallashi kerak."
      },
      "709530": {
        "ru": "Все правые значения сдвинуты на одно место влево. Проверь единицы.",
        "uz": "O'ngdagi barcha qiymatlar bir xona chapga siljigan. Birliklarni tekshiring."
      },
      "790053": {
        "ru": "Цифра 9 поставлена в десятки тысяч. Карточка 9 000 относится к тысячам.",
        "uz": "9 raqami o'n minglar xonasiga qo'yilgan. 9 000 kartasi minglarga tegishli."
      }
    },
    "inputWrongAudio": {
      "ru": "Проверь шесть разрядов и верни нули в пустые места.",
      "uz": "Oltita xonani tekshiring va nollarni bo'sh o'rinlarga qaytaring."
    },
    "audio": {
      "intro": {
        "ru": [
          "Восстанови число из семисот тысяч, девяти тысяч, пятидесяти и трёх. Пустые разряды заполни нулями."
        ],
        "uz": [
          "Yetti yuz ming, to'qqiz ming, ellik va uch qiymatlaridan sonni tiklang. Bo'sh xonalarni nollar bilan to'ldiring."
        ]
      },
      "on_correct": {
        "ru": "Запись точная. Нули удержали пустые разряды.",
        "uz": "Yozuv aniq. Nollar bo'sh xonalarni saqladi."
      },
      "on_wrong": {
        "ru": "Проверь шесть разрядов и верни нули в пустые места.",
        "uz": "Oltita xonani tekshiring va nollarni bo'sh o'rinlarga qaytaring."
      }
    }
  },
  "s9": {
    "eyebrow": {
      "ru": "Разбор примеров",
      "uz": "Misollar tahlili"
    },
    "title": {
      "ru": "Четыре решения в одном обзоре",
      "uz": "To'rtta yechim bitta sharhda"
    },
    "lead": {
      "ru": "Проследи, как место цифры помогает назвать разряд, значение, число и его развёрнутую запись.",
      "uz": "Raqamning o'rni xona, qiymat, son va uning yoyiq yozuvini aniqlashga qanday yordam berishini kuzating."
    },
    "audio": {
      "intro": {
        "ru": [
          "Разберём четыре готовых примера о цифрах, разрядах, значениях и разложении числа."
        ],
        "uz": [
          "Raqam, xona, qiymat va sonning yoyiq yozuviga oid to'rtta tayyor misolni tahlil qilamiz."
        ]
      }
    },
    "items": [
      {
        "question": {
          "ru": "В каком разряде стоит цифра 8 в числе 681 407?",
          "uz": "681 407 sonida 8 raqami qaysi xonada turibdi?"
        },
        "options": [
          {
            "ru": "десятки тысяч",
            "uz": "o'n minglar"
          },
          {
            "ru": "тысячи",
            "uz": "minglar"
          },
          {
            "ru": "сотни тысяч",
            "uz": "yuz minglar"
          },
          {
            "ru": "сотни",
            "uz": "yuzlar"
          }
        ],
        "correctIndex": 0,
        "correctText": {
          "ru": "Цифра 8 стоит в десятках тысяч.",
          "uz": "8 raqami o'n minglar xonasida turibdi."
        },
        "wrong": [
          null,
          {
            "ru": "В тысячах стоит цифра 1. Цифра 8 находится левее.",
            "uz": "Minglar xonasida 1 turibdi. 8 raqami undan chapda."
          },
          {
            "ru": "В сотнях тысяч стоит цифра 6. Цифра 8 находится правее.",
            "uz": "Yuz minglar xonasida 6 turibdi. 8 raqami undan o'ngda."
          },
          {
            "ru": "В сотнях стоит цифра 4. Считай разряды справа налево.",
            "uz": "Yuzlar xonasida 4 turibdi. Xonalarni o'ngdan chapga sanang."
          }
        ],
        "audio": {
          "intro": {
            "ru": [
              "Назови разряд цифры восемь в числе шестьсот восемьдесят одна тысяча четыреста семь."
            ],
            "uz": [
              "Olti yuz sakson bir ming to'rt yuz yetti sonidagi sakkiz raqamining xonasini toping."
            ]
          },
          "on_correct": {
            "ru": "Верно. Это разряд десятков тысяч.",
            "uz": "To'g'ri. Bu o'n minglar xonasi."
          },
          "on_wrong": [
            null,
            {
              "ru": "В тысячах стоит единица. Посмотри на один столбец левее.",
              "uz": "Minglar xonasida bir turibdi. Bir ustun chapga qarang."
            },
            {
              "ru": "В сотнях тысяч стоит шесть. Цифра восемь находится правее.",
              "uz": "Yuz minglarda olti turibdi. Sakkiz undan o'ngda."
            },
            {
              "ru": "Сотни находятся в правом классе. Цифра восемь стоит левее.",
              "uz": "Yuzlar o'ng sinfda. Sakkiz raqami undan chapda."
            }
          ]
        }
      },
      {
        "question": {
          "ru": "Чему равно значение цифры 6 в числе 306 254?",
          "uz": "306 254 sonidagi 6 raqamining qiymati qancha?"
        },
        "options": [
          "6 000",
          "600",
          "60 000",
          "6"
        ],
        "correctIndex": 0,
        "correctText": {
          "ru": "В разряде тысяч цифра 6 имеет значение 6 000.",
          "uz": "Minglar xonasidagi 6 raqami 6 000 qiymatga ega."
        },
        "wrong": [
          null,
          {
            "ru": "600 относится к сотням. Цифра 6 стоит левее.",
            "uz": "600 yuzlar xonasiga tegishli. 6 raqami undan chapda."
          },
          {
            "ru": "60 000 относится к десяткам тысяч. В этом разряде стоит ноль.",
            "uz": "60 000 o'n minglar xonasiga tegishli. Bu xonada nol turibdi."
          },
          {
            "ru": "Это цифра без учёта разряда. В тысячах её значение больше.",
            "uz": "Bu xona hisobga olinmagan raqam. Minglarda uning qiymati kattaroq."
          }
        ],
        "audio": {
          "intro": {
            "ru": [
              "Определи значение цифры шесть в числе триста шесть тысяч двести пятьдесят четыре."
            ],
            "uz": [
              "Uch yuz olti ming ikki yuz ellik to'rt sonidagi olti raqamining qiymatini aniqlang."
            ]
          },
          "on_correct": {
            "ru": "Да. Цифра шесть в тысячах означает шесть тысяч.",
            "uz": "Ha. Minglardagi olti raqami olti mingni bildiradi."
          },
          "on_wrong": [
            null,
            {
              "ru": "Шестьсот относится к сотням. Найди разряд тысяч.",
              "uz": "Olti yuz yuzlarga tegishli. Minglar xonasini toping."
            },
            {
              "ru": "Шестьдесят тысяч относится к соседнему разряду слева.",
              "uz": "Oltmish ming chapdagi qo'shni xonaga tegishli."
            },
            {
              "ru": "Добавь значение разряда тысяч к цифре шесть.",
              "uz": "Olti raqamiga minglar xonasi qiymatini qo'shing."
            }
          ]
        }
      },
      {
        "question": {
          "ru": "Какое число получится из 700 000 + 40 000 + 900 + 2?",
          "uz": "700 000 + 40 000 + 900 + 2 dan qaysi son hosil bo'ladi?"
        },
        "options": [
          "740 902",
          "704 902",
          "740 920",
          "74 902"
        ],
        "correctIndex": 0,
        "correctText": {
          "ru": "740 902 сохраняет каждое значение и пустой разряд десятков.",
          "uz": "740 902 har bir qiymatni va bo'sh o'nlar xonasini saqlaydi."
        },
        "wrong": [
          null,
          {
            "ru": "40 000 поставлено в тысячи. Оно относится к десяткам тысяч.",
            "uz": "40 000 minglarga qo'yilgan. U o'n minglarga tegishli."
          },
          {
            "ru": "Цифра 2 сдвинута в десятки. Значение 2 относится к единицам.",
            "uz": "2 raqami o'nlarga siljigan. 2 qiymati birliklarga tegishli."
          },
          {
            "ru": "Потерян разряд сотен тысяч. Число должно иметь шесть цифр.",
            "uz": "Yuz minglar xonasi yo'qolgan. Son oltita raqamdan iborat bo'lishi kerak."
          }
        ],
        "audio": {
          "intro": {
            "ru": [
              "Собери число из семисот тысяч, сорока тысяч, девятисот и двух."
            ],
            "uz": [
              "Yetti yuz ming, qirq ming, to'qqiz yuz va ikki qiymatlaridan sonni yig'ing."
            ]
          },
          "on_correct": {
            "ru": "Точно. Получилось семьсот сорок тысяч девятьсот два.",
            "uz": "Aniq. Yetti yuz qirq ming to'qqiz yuz ikki hosil bo'ldi."
          },
          "on_wrong": [
            null,
            {
              "ru": "Сорок тысяч должны занять десятки тысяч.",
              "uz": "Qirq ming o'n minglar xonasini egallashi kerak."
            },
            {
              "ru": "Двойка относится к единицам. Верни ноль в десятки.",
              "uz": "Ikki birliklarga tegishli. Nolni o'nlar xonasiga qaytaring."
            },
            {
              "ru": "Семьсот тысяч требует разряда сотен тысяч.",
              "uz": "Yetti yuz ming yuz minglar xonasini talab qiladi."
            }
          ]
        }
      },
      {
        "question": {
          "ru": "Как разложить число 205 070?",
          "uz": "205 070 sonini qanday yoyamiz?"
        },
        "options": [
          "200 000 + 5 000 + 70",
          "200 000 + 50 000 + 70",
          "200 000 + 5 000 + 700",
          "20 000 + 5 000 + 70"
        ],
        "correctIndex": 0,
        "correctText": {
          "ru": "Ненулевые цифры дают 200 000, 5 000 и 70.",
          "uz": "Noldan farqli raqamlar 200 000, 5 000 va 70 ni beradi."
        },
        "wrong": [
          null,
          {
            "ru": "Цифра 5 стоит в тысячах, а не в десятках тысяч. Уменьши это слагаемое.",
            "uz": "5 raqami o'n minglarda emas, minglarda turibdi. Bu qo'shiluvchini kichraytiring."
          },
          {
            "ru": "Цифра 7 стоит в десятках, а не в сотнях. Нужно слагаемое 70.",
            "uz": "7 raqami yuzlarda emas, o'nlarda turibdi. 70 qo'shiluvchisi kerak."
          },
          {
            "ru": "Цифра 2 стоит в сотнях тысяч. Первое слагаемое должно быть 200 000.",
            "uz": "2 raqami yuz minglar xonasida. Birinchi qo'shiluvchi 200 000 bo'lishi kerak."
          }
        ],
        "audio": {
          "intro": {
            "ru": [
              "Выбери разложение числа двести пять тысяч семьдесят."
            ],
            "uz": [
              "Ikki yuz besh ming yetmish sonining yoyiq yozuvini tanlang."
            ]
          },
          "on_correct": {
            "ru": "Верно. Три ненулевые цифры дали три разрядных слагаемых.",
            "uz": "To'g'ri. Uchta noldan farqli raqam uchta xona qo'shiluvchisini berdi."
          },
          "on_wrong": [
            null,
            {
              "ru": "Пятёрка стоит в тысячах. Уменьши второе слагаемое.",
              "uz": "Besh minglar xonasida turibdi. Ikkinchi qo'shiluvchini kichraytiring."
            },
            {
              "ru": "Семёрка стоит в десятках. Нужны семь десятков.",
              "uz": "Yetti o'nlar xonasida. Yetti o'nlik kerak."
            },
            {
              "ru": "Двойка обозначает сотни тысяч. Верни первый разряд.",
              "uz": "Ikki yuz minglarni bildiradi. Birinchi xonani qaytaring."
            }
          ]
        }
      }
    ],
    "completionText": {
      "ru": "Четыре решения разобраны.",
      "uz": "To'rtta yechim tahlil qilindi."
    }
  },
  "s10": {
    "eyebrow": {
      "ru": "Лаборатория решения",
      "uz": "Yechim laboratoriyasi"
    },
    "title": {
      "ru": "Собираем число из перемешанных карточек",
      "uz": "Aralash kartalardan sonni yig'amiz"
    },
    "lead": {
      "ru": "Карточки пришли без порядка. Полное решение сначала возвращает каждой карточке разряд, затем восстанавливает пустое место.",
      "uz": "Kartalar tartibsiz keldi. To'liq yechim avval har bir kartani o'z xonasiga qaytaradi, keyin bo'sh joyni tiklaydi."
    },
    "instruction": {
      "ru": "Восстановим число из пяти разрядных значений и проверим его обратным разложением.",
      "uz": "Sonni beshta xona qiymatidan tiklaymiz va uni qayta yoyib tekshiramiz."
    },
    "shuffledCards": [
      "5",
      "80 000",
      "4 000",
      "600 000",
      "200"
    ],
    "slots": [
      {
        "place": {
          "ru": "сотни тысяч",
          "uz": "yuz minglar"
        },
        "digit": "6",
        "value": "600 000"
      },
      {
        "place": {
          "ru": "десятки тысяч",
          "uz": "o'n minglar"
        },
        "digit": "8",
        "value": "80 000"
      },
      {
        "place": {
          "ru": "тысячи",
          "uz": "minglar"
        },
        "digit": "4",
        "value": "4 000"
      },
      {
        "place": {
          "ru": "сотни",
          "uz": "yuzlar"
        },
        "digit": "2",
        "value": "200"
      },
      {
        "place": {
          "ru": "десятки",
          "uz": "o'nlar"
        },
        "digit": "0",
        "value": {
          "ru": "карточки нет",
          "uz": "karta yo'q"
        },
        "empty": true
      },
      {
        "place": {
          "ru": "единицы",
          "uz": "birlar"
        },
        "digit": "5",
        "value": "5"
      }
    ],
    "steps": [
      {
        "label": {
          "ru": "1. Найти место",
          "uz": "1. O'rinni topish"
        },
        "text": {
          "ru": "Количество нулей и значение карточки показывают её разряд.",
          "uz": "Nollar soni va karta qiymati uning xonasini ko'rsatadi."
        }
      },
      {
        "label": {
          "ru": "2. Заполнить пробел",
          "uz": "2. Bo'sh joyni to'ldirish"
        },
        "text": {
          "ru": "Карточки десятков нет, поэтому в этот разряд ставим 0.",
          "uz": "O'nlar kartasi yo'q, shuning uchun bu xonaga 0 qo'yamiz."
        }
      },
      {
        "label": {
          "ru": "3. Проверить",
          "uz": "3. Tekshirish"
        },
        "text": {
          "ru": "Снова раскладываем полученное число и сравниваем набор значений.",
          "uz": "Hosil bo'lgan sonni yana yoyib, qiymatlar to'plami bilan solishtiramiz."
        }
      }
    ],
    "result": "684 205",
    "verification": "600 000 + 80 000 + 4 000 + 200 + 5",
    "conclusion": {
      "ru": "684 205 — единственная запись, в которой каждая карточка сохранила свой разряд, а отсутствующие десятки обозначены нулём.",
      "uz": "684 205 har bir karta o'z xonasini saqlagan va yo'q o'nlar nol bilan belgilangan yagona yozuvdir."
    },
    "replay": {
      "ru": "Повторить сборку",
      "uz": "Yig'ishni takrorlash"
    },
    "audio": {
      "ru": [
        "Карточки пришли в случайном порядке. Сначала определим разряд каждой карточки по её значению.",
        "Шестьсот тысяч ставим в сотни тысяч, восемьдесят тысяч в десятки тысяч, четыре тысячи в тысячи, двести в сотни, а пять в единицы.",
        "Карточки десятков нет, поэтому пустое место заполняем нулём. Получается шестьсот восемьдесят четыре тысячи двести пять.",
        "Обратное разложение возвращает все пять исходных значений. Значит, число восстановлено точно."
      ],
      "uz": [
        "Kartalar tasodifiy tartibda keldi. Avval har bir kartaning xonasini uning qiymati orqali aniqlaymiz.",
        "Olti yuz mingni yuz minglarga, sakson mingni o'n minglarga, to'rt mingni minglarga, ikki yuzni yuzlarga, beshni esa birlarga joylaymiz.",
        "O'nlar kartasi yo'q, shuning uchun bo'sh joyni nol bilan to'ldiramiz. Olti yuz sakson to'rt ming ikki yuz besh hosil bo'ladi.",
        "Qayta yoyish beshta dastlabki qiymatning barchasini qaytaradi. Demak, son aniq tiklandi."
      ]
    }
  },
  "s11": {
    "eyebrow": {
      "ru": "Выбор стратегии",
      "uz": "Strategiyani tanlash"
    },
    "title": {
      "ru": "Как надёжнее собрать число?",
      "uz": "Sonni qanday ishonchli yig'amiz?"
    },
    "lead": {
      "ru": "Сложение тоже даст ответ, но таблица лучше показывает пустые разряды.",
      "uz": "Qo'shish ham javob beradi, ammo jadval bo'sh xonalarni yaxshiroq ko'rsatadi."
    },
    "instruction": {
      "ru": "Какой способ надёжнее восстановит 608 401 из разрядных значений?",
      "uz": "608 401 sonini xona qiymatlaridan qaysi usul ishonchliroq tiklaydi?"
    },
    "model": {
      "kind": "rows",
      "badge": {
        "ru": "Пакет значений",
        "uz": "Qiymatlar to'plami"
      },
      "rows": [
        {
          "label": {
            "ru": "сотни тысяч",
            "uz": "yuz minglar"
          },
          "value": "600 000"
        },
        {
          "label": {
            "ru": "тысячи",
            "uz": "minglar"
          },
          "value": "8 000"
        },
        {
          "label": {
            "ru": "сотни",
            "uz": "yuzlar"
          },
          "value": "400"
        },
        {
          "label": {
            "ru": "единицы",
            "uz": "birlar"
          },
          "value": "1"
        }
      ]
    },
    "options": [
      {
        "ru": "Разместить значения в разрядной таблице, заполнить пустые места нулями и проверить сложением",
        "uz": "Qiymatlarni xona jadvaliga joylashtirish, bo'sh o'rinlarni nollar bilan to'ldirish va qo'shib tekshirish"
      },
      {
        "ru": "Сразу сложить все значения без разрядной таблицы",
        "uz": "Barcha qiymatlarni xona jadvalisiz darhol qo'shish"
      },
      {
        "ru": "Записать подряд только ненулевые цифры",
        "uz": "Faqat noldan farqli raqamlarni ketma-ket yozish"
      },
      {
        "ru": "Посчитать количество карточек",
        "uz": "Kartalar sonini sanash"
      }
    ],
    "correctIndex": 0,
    "correctText": {
      "ru": "Таблица явно показывает шесть мест, а сложение служит проверкой. Так нули не исчезнут.",
      "uz": "Jadval oltita o'rinni aniq ko'rsatadi, qo'shish esa tekshiruv bo'ladi. Shunda nollar yo'qolmaydi."
    },
    "wrong": [
      null,
      {
        "ru": "Сложение математически верно, но без таблицы легче пропустить пустой разряд. Добавь позиционную проверку.",
        "uz": "Qo'shish matematik jihatdan to'g'ri, ammo jadvalsiz bo'sh xonani o'tkazib yuborish oson. Xona bo'yicha tekshiruv qo'shing."
      },
      {
        "ru": "Так получится 6841 и пустые разряды исчезнут. Нули должны удержать их места.",
        "uz": "Bunday usulda 6841 hosil bo'lib, bo'sh xonalar yo'qoladi. Nollar ularning o'rnini saqlashi kerak."
      },
      {
        "ru": "Количество карточек не показывает разряды. Нужно разместить каждое значение по месту.",
        "uz": "Kartalar soni xonalarni ko'rsatmaydi. Har bir qiymatni o'z o'rniga joylashtirish kerak."
      }
    ],
    "audio": {
      "intro": {
        "ru": [
          "Выбери самый надёжный способ собрать число шестьсот восемь тысяч четыреста один и сохранить пустые разряды."
        ],
        "uz": [
          "Olti yuz sakkiz ming to'rt yuz bir sonini yig'ish va bo'sh xonalarni saqlashning eng ishonchli usulini tanlang."
        ]
      },
      "on_correct": {
        "ru": "Это надёжная стратегия. Таблица сохраняет места, а сложение проверяет результат.",
        "uz": "Bu ishonchli strategiya. Jadval o'rinlarni saqlaydi, qo'shish esa natijani tekshiradi."
      },
      "on_wrong": [
        null,
        {
          "ru": "Сложение подходит, но таблица лучше защищает от пропуска нулей.",
          "uz": "Qo'shish mos, ammo jadval nollarni tushirib qoldirishdan yaxshiroq himoya qiladi."
        },
        {
          "ru": "Ненулевые цифры без позиций дают другое число.",
          "uz": "Noldan farqli raqamlar xonalarsiz boshqa sonni beradi."
        },
        {
          "ru": "Нужно знать место каждой карточки, а не их количество.",
          "uz": "Kartalar sonini emas, har birining o'rnini bilish kerak."
        }
      ]
    }
  },
  "s12": {
    "eyebrow": {
      "ru": "Работа с ошибкой",
      "uz": "Xato bilan ishlash"
    },
    "title": {
      "ru": "Значение увеличили в десять раз",
      "uz": "Qiymat o'n marta oshirib yuborildi"
    },
    "lead": {
      "ru": "Алишер разложил число 407 206, но одна цифра попала не в свой разряд.",
      "uz": "Alisher 407 206 sonini yoydi, ammo bitta raqam noto'g'ri xonaga tushdi."
    },
    "instruction": {
      "ru": "Как исправить слагаемое 70 000?",
      "uz": "70 000 qo'shiluvchisini qanday tuzatamiz?"
    },
    "model": {
      "kind": "rows",
      "badge": {
        "ru": "Запись Алишера",
        "uz": "Alisherning yozuvi"
      },
      "number": "407 206",
      "rows": [
        {
          "label": {
            "ru": "записанное разложение",
            "uz": "yozilgan yoyiq yozuv"
          },
          "value": "400 000 + 70 000 + 200 + 6"
        },
        {
          "label": {
            "ru": "место цифры 7",
            "uz": "7 raqamining o'rni"
          },
          "value": {
            "ru": "тысячи",
            "uz": "minglar"
          }
        }
      ]
    },
    "options": [
      {
        "ru": "Заменить 70 000 на 7 000",
        "uz": "70 000 ni 7 000 ga almashtirish"
      },
      {
        "ru": "Заменить 70 000 на 700",
        "uz": "70 000 ni 700 ga almashtirish"
      },
      {
        "ru": "Оставить 70 000 без изменения",
        "uz": "70 000 ni o'zgarishsiz qoldirish"
      },
      {
        "ru": "Удалить слагаемое полностью",
        "uz": "Qo'shiluvchini butunlay olib tashlash"
      }
    ],
    "correctIndex": 0,
    "correctText": {
      "ru": "Цифра 7 стоит в тысячах, поэтому её значение 7 000. Исправленное разложение снова даёт 407 206.",
      "uz": "7 raqami minglar xonasida, shuning uchun uning qiymati 7 000. Tuzatilgan yoyiq yozuv yana 407 206 ni beradi."
    },
    "wrong": [
      null,
      {
        "ru": "700 относится к сотням, где уже стоит цифра 2. Семёрка находится левее.",
        "uz": "700 yuzlar xonasiga tegishli, u yerda 2 raqami turibdi. Yetti undan chapda."
      },
      {
        "ru": "70 000 поставило семёрку в десятки тысяч. В исходном числе там стоит цифра 0.",
        "uz": "70 000 yettini o'n minglar xonasiga qo'ydi. Dastlabki sonda u yerda 0 raqami turibdi."
      },
      {
        "ru": "Семёрку нельзя удалять: она есть в исходном числе. Нужно вернуть ей значение тысяч.",
        "uz": "Yettini olib tashlab bo'lmaydi, u dastlabki sonda bor. Unga minglar qiymatini qaytarish kerak."
      }
    ],
    "audio": {
      "intro": {
        "ru": [
          "Алишер записал для цифры семь значение семьдесят тысяч. Найди ошибку и верни цифру в правильный разряд."
        ],
        "uz": [
          "Alisher yetti raqami uchun yetmish ming qiymatini yozdi. Xatoni toping va raqamni to'g'ri xonaga qaytaring."
        ]
      },
      "on_correct": {
        "ru": "Ошибка исправлена. Семёрка в разряде тысяч означает семь тысяч.",
        "uz": "Xato tuzatildi. Minglar xonasidagi yetti raqami yetti mingni bildiradi."
      },
      "on_wrong": [
        null,
        {
          "ru": "Семьсот относится к сотням. Семёрка стоит в тысячах.",
          "uz": "Yetti yuz yuzlarga tegishli. Yetti minglar xonasida turibdi."
        },
        {
          "ru": "Семьдесят тысяч сдвигает цифру влево. Уменьши значение в десять раз.",
          "uz": "Yetmish ming raqamni chapga siljitadi. Qiymatni o'n marta kamaytiring."
        },
        {
          "ru": "Цифра семь нужна. Исправь её значение, а не удаляй.",
          "uz": "Yetti raqami kerak. Uni olib tashlamang, qiymatini tuzating."
        }
      ]
    }
  },
  "s13": {
    "eyebrow": {
      "ru": "Финальный перенос",
      "uz": "Yakuniy ko'chirish"
    },
    "title": {
      "ru": "Восстанови код городского сенсора",
      "uz": "Shahar sensori kodini tiklang"
    },
    "lead": {
      "ru": "Сенсор передал только разрядные значения. Нужно вернуть полный шестизначный код.",
      "uz": "Sensor faqat xona qiymatlarini yubordi. To'liq olti xonali kodni tiklash kerak."
    },
    "instruction": {
      "ru": "Какой код составлен из 500 000, 20 000, 600 и 8?",
      "uz": "500 000, 20 000, 600 va 8 dan qaysi kod tuziladi?"
    },
    "model": {
      "kind": "city",
      "badge": {
        "ru": "Сигнал Lumo City",
        "uz": "Lumo City signali"
      },
      "rows": [
        {
          "label": {
            "ru": "сотни тысяч",
            "uz": "yuz minglar"
          },
          "value": "500 000"
        },
        {
          "label": {
            "ru": "десятки тысяч",
            "uz": "o'n minglar"
          },
          "value": "20 000"
        },
        {
          "label": {
            "ru": "сотни",
            "uz": "yuzlar"
          },
          "value": "600"
        },
        {
          "label": {
            "ru": "единицы",
            "uz": "birlar"
          },
          "value": "8"
        }
      ]
    },
    "options": [
      "520 608",
      "502 608",
      "520 068",
      "520 680"
    ],
    "correctIndex": 0,
    "correctText": {
      "ru": "Код 520 608 сохраняет все значения. Нули удерживают пустые тысячи и десятки.",
      "uz": "520 608 kodi barcha qiymatlarni saqlaydi. Nollar bo'sh minglar va o'nlar xonalarini ushlab turadi."
    },
    "wrong": [
      null,
      {
        "ru": "20 000 превратилось в 2 000. Цифра 2 должна стоять в десятках тысяч.",
        "uz": "20 000 qiymati 2 000 ga aylangan. 2 raqami o'n minglar xonasida turishi kerak."
      },
      {
        "ru": "Значение 600 уменьшено до 60. Цифра 6 должна стоять в сотнях.",
        "uz": "600 qiymati 60 gacha kamaygan. 6 raqami yuzlar xonasida turishi kerak."
      },
      {
        "ru": "Цифра 8 сдвинута в десятки. Значение 8 относится к единицам.",
        "uz": "8 raqami o'nlarga siljigan. 8 qiymati birliklarga tegishli."
      }
    ],
    "audio": {
      "intro": {
        "ru": [
          "Городской сенсор передал пятьсот тысяч, двадцать тысяч, шестьсот и восемь. Восстанови полный код."
        ],
        "uz": [
          "Shahar sensori besh yuz ming, yigirma ming, olti yuz va sakkiz qiymatlarini yubordi. To'liq kodni tiklang."
        ]
      },
      "on_correct": {
        "ru": "Код восстановлен. Получилось пятьсот двадцать тысяч шестьсот восемь.",
        "uz": "Kod tiklandi. Besh yuz yigirma ming olti yuz sakkiz hosil bo'ldi."
      },
      "on_wrong": [
        null,
        {
          "ru": "Двадцать тысяч должны занять десятки тысяч.",
          "uz": "Yigirma ming o'n minglar xonasini egallashi kerak."
        },
        {
          "ru": "Шестьсот относится к сотням. Верни цифру шесть на одно место влево.",
          "uz": "Olti yuz yuzlar xonasiga tegishli. Olti raqamini bir xona chapga qaytaring."
        },
        {
          "ru": "Восемь относится к единицам. Верни ноль в десятки.",
          "uz": "Sakkiz birliklarga tegishli. Nolni o'nlar xonasiga qaytaring."
        }
      ]
    }
  },
  "s14": {
    "eyebrow": {
      "ru": "Итог и мост",
      "uz": "Yakun va ko'prik"
    },
    "title": {
      "ru": "Цифра, разряд и значение работают вместе",
      "uz": "Raqam, xona va qiymat birga ishlaydi"
    },
    "lead": {
      "ru": "Выбери цепочку, которая описывает полный способ.",
      "uz": "To'liq usulni ifodalaydigan ketma-ketlikni tanlang."
    },
    "instruction": {
      "ru": "Как перейти от записи числа к его составу?",
      "uz": "Son yozuvidan uning tarkibiga qanday o'tamiz?"
    },
    "model": {
      "kind": "reward",
      "badge": {
        "ru": "Модуль восстановлен",
        "uz": "Modul tiklandi"
      },
      "number": {
        "ru": "ЦИФРА → РАЗРЯД → ЗНАЧЕНИЕ",
        "uz": "RAQAM → XONA → QIYMAT"
      },
      "steps": [
        {
          "ru": "Найти цифру",
          "uz": "Raqamni topish"
        },
        {
          "ru": "Назвать разряд",
          "uz": "Xonani aytish"
        },
        {
          "ru": "Записать разрядное значение",
          "uz": "Xona qiymatini yozish"
        }
      ]
    },
    "options": [
      {
        "ru": "Цифра → разряд → разрядное значение → разложение или восстановление",
        "uz": "Raqam → xona → xona qiymati → yoyish yoki tiklash"
      },
      {
        "ru": "Цифра → соседняя цифра → сумма цифр",
        "uz": "Raqam → qo'shni raqam → raqamlar yig'indisi"
      },
      {
        "ru": "Разряд → удаление нулей → короткая запись",
        "uz": "Xona → nollarni olib tashlash → qisqa yozuv"
      },
      {
        "ru": "Чтение справа налево → перестановка значений",
        "uz": "O'ngdan chapga o'qish → qiymatlarni almashtirish"
      }
    ],
    "correctIndex": 0,
    "correctText": {
      "ru": "Полная цепочка связывает знак, место и значение. Она помогает и разложить число, и собрать его обратно.",
      "uz": "To'liq ketma-ketlik belgi, o'rin va qiymatni bog'laydi. U sonni yoyish va qayta yig'ishga yordam beradi."
    },
    "bridge": {
      "ru": "Дальше сравним многозначные числа: решающим станет первое различающееся разрядное значение слева.",
      "uz": "Keyin ko'p xonali sonlarni taqqoslaymiz: chapdagi birinchi farqli xona qiymati hal qiluvchi bo'ladi."
    },
    "wrong": [
      null,
      {
        "ru": "Соседняя цифра и сумма цифр не показывают разрядное значение. Начни с места цифры.",
        "uz": "Qo'shni raqam va raqamlar yig'indisi xona qiymatini ko'rsatmaydi. Raqam o'rnidan boshlang."
      },
      {
        "ru": "Удаление нулей сдвигает разряды. Пустые места нужно сохранять.",
        "uz": "Nollarni olib tashlash xonalarni siljitadi. Bo'sh o'rinlarni saqlash kerak."
      },
      {
        "ru": "Разряды читаются и анализируются слева направо без перестановки. Значения должны остаться на местах.",
        "uz": "Xonalar chapdan o'ngga almashtirilmasdan o'qiladi va tahlil qilinadi. Qiymatlar o'z o'rnida qolishi kerak."
      }
    ],
    "audio": {
      "intro": {
        "ru": [
          "Выбери цепочку, которая связывает цифру, разряд, значение и разложение многозначного числа."
        ],
        "uz": [
          "Raqam, xona, qiymat va ko'p xonali sonning yoyiq yozuvini bog'laydigan ketma-ketlikni tanlang."
        ]
      },
      "on_correct": {
        "ru": "Состав числа раскрыт. На следующем уроке разрядные значения помогут сравнивать многозначные числа.",
        "uz": "Sonning tarkibi ochildi. Keyingi darsda xona qiymatlari ko'p xonali sonlarni taqqoslashga yordam beradi."
      },
      "on_wrong": [
        null,
        {
          "ru": "Вернись к месту цифры. Именно оно определяет значение.",
          "uz": "Raqamning o'rniga qayting. Aynan shu o'rin qiymatni belgilaydi."
        },
        {
          "ru": "Нули сохраняют пустые разряды. Их нельзя удалять.",
          "uz": "Nollar bo'sh xonalarni saqlaydi. Ularni olib tashlab bo'lmaydi."
        },
        {
          "ru": "Сохрани порядок разрядов слева направо.",
          "uz": "Xonalar tartibini chapdan o'ngga saqlang."
        }
      ]
    }
  }
};

// Connected ideas are grouped into deep screens; the lesson does not use
// one slide per tiny fact.
const SCREEN_META = [
  { id: 's0', type: 'hook', subtype: 'mission-foundation', template: 'FoundationTheory', goal: 'See why equal digits can carry different values', misconceptions: ['equal digits always have equal values'], active: false, scored: false, scope: 'hook', resetOnReturn: true },
  { id: 's1', type: 'exploration', subtype: 'recap-to-position', template: 'DeepSequence', goal: 'Connect number notation with a digit position', misconceptions: ['class boundary or zero lost', 'largest digit has largest value'], active: false, scored: false, scope: null, resetOnReturn: true },
  { id: 's2', type: 'exploration', subtype: 'place-value-ladder', template: 'PlaceValueLadder', goal: 'Explain why one leftward shift multiplies the same digit value by ten', misconceptions: ['the digit changes when its value changes', 'leftward shift only adds one'], active: false, scored: false, scope: null, resetOnReturn: false },
  { id: 's3', type: 'exploration', subtype: 'equal-digits-different-values', template: 'DeepSequence', goal: 'Explain equal digits in different places and complete the expansion', misconceptions: ['digit and value are identical', 'place shifted by ten'], active: false, scored: false, scope: null, resetOnReturn: true },
  { id: 's4', type: 'exploration', subtype: 'value-to-expansion', template: 'DeepSequence', goal: 'Move from one digit value to the full expanded form', misconceptions: ['digit entered instead of value', 'digits shifted right'], active: false, scored: false, scope: null, resetOnReturn: false },
  { id: 's5', type: 'exploration', subtype: 'zero-coefficient-contrast', template: 'ZeroCoefficientTheory', goal: 'Distinguish omitting a zero addend from deleting a zero place in ordinary notation', misconceptions: ['zero addend and zero digit can both be removed'], active: false, scored: false, scope: null, resetOnReturn: false },
  { id: 's6', type: 'exploration', subtype: 'zero-and-reconstruction', template: 'DeepSequence', goal: 'Preserve internal zero places while expanding and reconstructing', misconceptions: ['zero addend and zero digit both removed'], active: false, scored: false, scope: null, resetOnReturn: true },
  { id: 's7', type: 'rule', subtype: 'rule-assembly', template: 'RuleReveal', goal: 'Assemble the place-value algorithm', misconceptions: ['nonzero digits concatenated'], active: false, scored: false, scope: null, resetOnReturn: false },
  { id: 's8', type: 'test', subtype: 'reconstruction-input', template: 'NumInputScreen', goal: 'Reconstruct a number with internal zeros', misconceptions: ['empty places removed'], active: true, scored: true, scope: 'module-mikro', resetOnReturn: false },
  { id: 's9', type: 'exploration', subtype: 'worked-checkpoint', template: 'WorkedExamplesScreen', goal: 'Review digit, place, value, expansion, and reconstruction in four solved examples', misconceptions: ['place-value shifts'], active: false, scored: false, scope: null, resetOnReturn: false },
  { id: 's10', type: 'exploration', subtype: 'shuffled-card-solution-lab', template: 'CardSolutionLab', goal: 'Reconstruct and verify a number from shuffled place-value cards with a missing place', misconceptions: ['cards concatenated without zero placeholders'], active: false, scored: false, scope: null, resetOnReturn: true },
  { id: 's11', type: 'exploration', subtype: 'strategy-walkthrough', template: 'StrategyTheory', goal: 'Compare reconstruction strategies and keep zero places', misconceptions: ['concatenation ignores zero places'], active: false, scored: false, scope: null, resetOnReturn: false },
  { id: 's12', type: 'case', subtype: 'error-walkthrough', template: 'ErrorWalkthrough', goal: 'Explain and repair a value enlarged tenfold', misconceptions: ['thousands read as ten-thousands'], active: false, scored: false, scope: null, resetOnReturn: false },
  { id: 's13', type: 'test', subtype: 'final-transfer', template: 'MCScreen', goal: 'Reconstruct a city sensor code from place values', misconceptions: ['internal places shifted'], active: true, scored: true, scope: 'final', resetOnReturn: false },
  { id: 's14', type: 'summary', subtype: 'reflection', template: 'SummaryTheory', goal: 'Summarize the digit-to-place-value chain and bridge to comparison', misconceptions: ['digit sum replaces place value'], active: false, scored: false, scope: null, resetOnReturn: false },
];

const TOTAL_SCREENS = 15;
const FREE_NAV = false;
const MOBILE_DESIGN_W = 390;
const NOTION_FLOW = SCREEN_META.map((meta, screen) => ({ screen, meta, contentKeys: [meta.id] }));

const LESSON_META = {
  lessonId: 'num-4-03-v1',
  lessonTitle: {
    ru: 'Урок 3. Разрядный состав многозначного числа',
    uz: "3-dars. Ko'p xonali sonning xona tarkibi",
  },
  skillTags: ['digit_place_value', 'place_table', 'expanded_form', 'number_reconstruction', 'internal_zero'],
  notionFlow: NOTION_FLOW,
};

let runtimeConfig = {
  ttsApiBase: '',
  correctSoundUrl: '',
  wrongSoundUrl: '',
  studentName: '',
  voiceGender: 'f',
};

const configureLesson = (next) => {
  runtimeConfig = { ...runtimeConfig, ...next };
};

const LangContext = createContext('ru');
const useLang = () => useContext(LangContext);

const useT = () => {
  const lang = useLang();
  return useCallback((value) => {
    if (value === null || value === undefined) return '';
    if (React.isValidElement(value)) return value;
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    return value[lang] ?? value.ru ?? '';
  }, [lang]);
};

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false,
  );
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const update = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [breakpoint]);
  return isMobile;
}

function useMobileZoom(breakpoint = 640) {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const root = document.documentElement;
    const update = () => {
      const zoom = window.innerWidth < breakpoint ? window.innerWidth / MOBILE_DESIGN_W : 1;
      root.style.setProperty('--g4z', String(zoom));
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      root.style.removeProperty('--g4z');
    };
  }, [breakpoint]);
}

const buildTtsUrl = (base, text, gender) => {
  const encoded = encodeURIComponent(String(text).slice(0, 1000));
  return `${base}/api/tts?text=${encoded}&g=${gender === 'm' ? 'm' : 'f'}`;
};

class AudioEngine {
  constructor() {
    this.queue = [];
    this.index = 0;
    this.audio = null;
    this.previewUtterance = null;
    this.previewTimer = null;
    this.lang = 'ru';
    this.muted = false;
    this.isPlaying = false;
    this.onStateChange = null;
  }

  emit(extra = {}) {
    this.onStateChange?.({ isPlaying: this.isPlaying, muted: this.muted, ...extra });
  }

  ensureAudio() {
    if (!this.audio && typeof window !== 'undefined') {
      this.audio = new Audio();
      this.audio.crossOrigin = 'anonymous';
      this.audio.preload = 'auto';
    }
    return this.audio;
  }

  setLang(lang) {
    this.lang = lang;
  }

  loadQueue(segments) {
    this.stop(false);
    this.queue = Array.isArray(segments) ? segments : [];
    this.index = 0;
  }

  start() {
    if (this.muted) {
      this.emit({ completed: true, currentSegment: null });
      return;
    }
    this.emit({ completed: false });
    this.playCurrent();
  }

  playCurrent() {
    const segment = this.queue[this.index];
    if (!segment) {
      this.isPlaying = false;
      this.emit({ completed: true, currentSegment: null });
      return;
    }
    this.playText(segment.text, () => {
      this.index += 1;
      this.playCurrent();
    }, segment.id);
  }

  playText(text, done, id = 'one-off') {
    if (!text || this.muted) {
      done?.();
      return;
    }
    const base = runtimeConfig.ttsApiBase;
    if (base) {
      const audio = this.ensureAudio();
      if (!audio) {
        done?.();
        return;
      }
      audio.onended = () => {
        this.isPlaying = false;
        this.emit({ currentSegment: null });
        done?.();
      };
      audio.onerror = () => {
        this.isPlaying = false;
        this.emit({ currentSegment: null });
        done?.();
      };
      audio.src = buildTtsUrl(base, text, runtimeConfig.voiceGender);
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(() => {
          this.isPlaying = true;
          this.emit({ currentSegment: id });
        }).catch(() => {
          this.isPlaying = false;
          this.emit({ completed: true, currentSegment: null });
          done?.();
        });
      }
      return;
    }

    // Local preview only. LMS playback keeps using the HTTP TTS branch above.
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      done?.();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(String(text));
    utterance.lang = this.lang === 'uz' ? 'uz-UZ' : 'ru-RU';
    utterance.rate = 0.94;
    utterance.onstart = () => {
      this.isPlaying = true;
      this.emit({ currentSegment: id });
    };
    utterance.onend = () => {
      if (this.previewUtterance === utterance) this.previewUtterance = null;
      this.isPlaying = false;
      this.emit({ currentSegment: null });
      done?.();
    };
    utterance.onerror = () => {
      if (this.previewUtterance === utterance) this.previewUtterance = null;
      this.isPlaying = false;
      this.emit({ currentSegment: null });
      done?.();
    };
    this.previewUtterance = utterance;
    this.previewTimer = window.setTimeout(() => {
      this.previewTimer = null;
      if (this.previewUtterance !== utterance || this.muted) return;
      try {
        window.speechSynthesis.speak(utterance);
      } catch {
        this.previewUtterance = null;
        done?.();
      }
    }, 50);
  }

  pushOneOff(text) {
    this.stop(false);
    this.queue = [{ id: `feedback-${Date.now()}`, text }];
    this.index = 0;
    this.start();
  }

  replay() {
    this.stop(false);
    this.index = 0;
    this.start();
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stop(false);
      this.emit({ completed: true, currentSegment: null });
      return;
    }
    this.index = 0;
    this.start();
  }

  stop(emit = true) {
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.onended = null;
        this.audio.onerror = null;
      } catch {
        // Audio cleanup is best effort.
      }
    }
    if (this.previewTimer !== null && typeof window !== 'undefined') {
      window.clearTimeout(this.previewTimer);
      this.previewTimer = null;
    }
    if (this.previewUtterance) {
      this.previewUtterance.onstart = null;
      this.previewUtterance.onend = null;
      this.previewUtterance.onerror = null;
      this.previewUtterance = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Preview speech cleanup is best effort.
      }
    }
    this.isPlaying = false;
    if (emit) this.emit({ currentSegment: null });
  }
}

let audioEngineInstance = null;
const getAudioEngine = () => {
  if (typeof window === 'undefined') return null;
  if (!audioEngineInstance) audioEngineInstance = new AudioEngine();
  return audioEngineInstance;
};

function useAudio(segments) {
  const lang = useLang();
  const initiallyMuted = audioEngineInstance?.muted ?? false;
  const [state, setState] = useState({
    isPlaying: false,
    muted: initiallyMuted,
    completed: initiallyMuted,
    currentSegment: null,
  });

  /* eslint-disable react-hooks/refs -- stable queue prevents audio restart loops */
  const segmentsRef = useRef(segments);
  const segmentsKey = segments ? JSON.stringify(segments) : '';
  const previousKeyRef = useRef(segmentsKey);
  if (previousKeyRef.current !== segmentsKey) {
    segmentsRef.current = segments;
    previousKeyRef.current = segmentsKey;
  }
  const stableSegments = segmentsRef.current;
  /* eslint-enable react-hooks/refs */

  useEffect(() => {
    const engine = getAudioEngine();
    if (!engine) return undefined;
    engine.setLang(lang);
    engine.onStateChange = (next) => setState((previous) => ({ ...previous, ...next }));
    engine.loadQueue(stableSegments);
    if (stableSegments?.length && !engine.muted) {
      const timer = window.setTimeout(() => engine.start(), 250);
      return () => {
        window.clearTimeout(timer);
        engine.stop(false);
        engine.onStateChange = null;
      };
    }
    engine.emit({ completed: true, currentSegment: null });
    return () => {
      engine.stop(false);
      engine.onStateChange = null;
    };
  }, [stableSegments, lang]);

  return {
    ...state,
    replay: () => getAudioEngine()?.replay(),
    toggleMute: () => getAudioEngine()?.toggleMute(),
    pushOneOff: (text) => getAudioEngine()?.pushOneOff(text),
  };
}

const localizedSegments = (audioValue, lang, prefix) => {
  if (!audioValue) return [];
  const localized = audioValue[lang] ?? audioValue.ru ?? '';
  const values = Array.isArray(localized) ? localized : [localized];
  return values.filter(Boolean).map((text, index) => ({ id: `${prefix}-${index}`, text }));
};

function useCanAnswer(audio) {
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setTimedOut(true), 12000);
    return () => window.clearTimeout(timer);
  }, []);
  return FREE_NAV || audio.muted || audio.completed || timedOut;
}

function useAdvanceGate(solved, audio) {
  const [delayElapsed, setDelayElapsed] = useState(false);
  useEffect(() => {
    if (!solved) return undefined;
    const timer = window.setTimeout(() => setDelayElapsed(true), 1200);
    return () => window.clearTimeout(timer);
  }, [solved]);
  if (FREE_NAV) return true;
  if (!solved) return false;
  if (audio.muted) return true;
  return delayElapsed && !audio.isPlaying;
}

const useTheoryAdvanceGate = (audio) => (
  FREE_NAV || audio.muted || audio.completed
);

const playSfx = (kind) => {
  const url = kind === 'correct' ? runtimeConfig.correctSoundUrl : runtimeConfig.wrongSoundUrl;
  if (!url || typeof window === 'undefined') return;
  try {
    const sound = new Audio(url);
    sound.volume = 0.6;
    const promise = sound.play();
    promise?.catch?.(() => {});
  } catch {
    // SFX must never block the lesson.
  }
};

const buildOptionOrder = (length, correctIndex, seed = 0) => {
  const natural = Array.from({ length }, (_, index) => index);
  if (length < 2 || !natural.includes(correctIndex)) return natural;
  const target = Math.abs(seed * 3 + 1) % length;
  const order = natural.filter((index) => index !== correctIndex);
  order.splice(target, 0, correctIndex);
  return order;
};

const autoScrollTo = (element) => {
  if (!element || typeof element.scrollIntoView !== 'function') return;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  element.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
};

function useRevealScroll(active, delay = 320) {
  const ref = useRef(null);
  useEffect(() => {
    if (!active) return undefined;
    let timer = 0;
    const firstFrame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        timer = window.setTimeout(() => autoScrollTo(ref.current), delay);
      });
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      window.clearTimeout(timer);
    };
  }, [active, delay]);
  return ref;
}

const AudioIndicator = ({ audio }) => {
  const lang = useLang();
  const muteLabel = audio.muted
    ? (lang === 'uz' ? 'Ovozni yoqish' : 'Включить звук')
    : (lang === 'uz' ? "Ovozni o'chirish" : 'Выключить звук');
  const replayLabel = lang === 'uz' ? 'Qayta eshitish' : 'Повторить';
  return (
    <div className="audio-controls">
      <button type="button" className="icon-btn" onClick={audio.toggleMute} aria-label={muteLabel} title={muteLabel}>
        {audio.muted ? '🔇' : (audio.isPlaying ? '🔊' : '🔉')}
      </button>
      {!audio.muted && (
        <button type="button" className="icon-btn" onClick={audio.replay} aria-label={replayLabel} title={replayLabel}>
          ↻
        </button>
      )}
    </div>
  );
};

// The same canonical Bit used by the approved grade 4 lesson template.
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

const FeedbackBlock = ({ show, correct, children }) => {
  const lang = useLang();
  const revealRef = useRevealScroll(show);
  return (
    <div ref={revealRef} className={`feedback ${show ? 'feedback-visible' : ''}`} aria-hidden={!show} aria-live="polite">
      <div className={`feedback-card ${correct ? 'feedback-correct' : 'feedback-hint'}`}>
        <BitSVG state={correct ? 'nod' : 'awkward'} />
        <div>
          <strong>{correct ? (lang === 'uz' ? 'YECHIM' : 'РЕШЕНИЕ') : (lang === 'uz' ? "YANA O'YLANG" : 'ПРОВЕРЬ СТРАТЕГИЮ')}</strong>
          <p>{children}</p>
        </div>
      </div>
    </div>
  );
};

const ScreenTypeLabel = ({ type }) => {
  const lang = useLang();
  const labels = {
    hook: lang === 'uz' ? 'Missiya' : 'Миссия',
    diagnostic: lang === 'uz' ? 'Diagnostika' : 'Диагностика',
    exploration: lang === 'uz' ? 'Kashfiyot' : 'Исследование',
    rule: lang === 'uz' ? 'Qoida' : 'Правило',
    practice: lang === 'uz' ? 'Mashq' : 'Практика',
    test: lang === 'uz' ? 'Tekshiruv' : 'Проверка',
    case: lang === 'uz' ? 'Vazifa' : 'Задача',
    summary: lang === 'uz' ? 'Yakun' : 'Итог',
  };
  return <span className="screen-type">{labels[type] ?? type}</span>;
};

const MOBILE_AUTO_SCROLL_TARGETS = [
  '.feedback-visible',
  '.theory-callout',
  '.worked-example-grid',
  '.summary-bridge',
];

const Stage = ({ screen, eyebrow, audio, children, nav }) => {
  const t = useT();
  const isMobile = useIsMobile();
  const contentRef = useRef(null);
  const pad = isMobile ? 14 : 48;
  const meta = SCREEN_META[screen];

  useEffect(() => {
    const scroller = contentRef.current;
    if (!scroller) return undefined;

    scroller.scrollTo({ top: 0, behavior: 'auto' });
    if (!isMobile) return undefined;

    let frameId = 0;
    let settleTimer = 0;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const revealCurrentTarget = () => {
      const target = MOBILE_AUTO_SCROLL_TARGETS
        .map((selector) => scroller.querySelector(selector))
        .find(Boolean);
      if (!target) return;

      const viewport = scroller.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const safeTop = viewport.top + 10;
      const safeBottom = viewport.bottom - 14;
      let nextTop = scroller.scrollTop;

      if (targetRect.bottom > safeBottom) nextTop += targetRect.bottom - safeBottom;
      else if (targetRect.top < safeTop) nextTop -= safeTop - targetRect.top;
      else return;

      const maxTop = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
      scroller.scrollTo({
        top: Math.max(0, Math.min(nextTop, maxTop)),
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    };

    const scheduleReveal = () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(settleTimer);
      frameId = requestAnimationFrame(revealCurrentTarget);
      settleTimer = window.setTimeout(revealCurrentTarget, 720);
    };

    const observer = new MutationObserver(scheduleReveal);
    observer.observe(scroller, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['class', 'aria-hidden'],
    });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
      window.clearTimeout(settleTimer);
    };
  }, [isMobile, screen]);

  return (
    <main className={`stage stage-${meta.type}`}>
      <header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}>
        <div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}>
          <div className="progress-fill progress-bar" style={{ width: `${((screen + 1) / TOTAL_SCREENS) * 100}%` }} />
        </div>
        <div className="stage-chrome">
          <div className="chrome-title"><span className="status-dot" /><span>{t(eyebrow)}</span></div>
          <div className="chrome-actions">
            <ScreenTypeLabel type={meta.type} />
            {audio && <AudioIndicator audio={audio} />}
            <span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span>
          </div>
        </div>
      </header>
      <section ref={contentRef} className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}>
        {children}
      </section>
      <footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>{nav}</footer>
    </main>
  );
};

const ModelPanel = ({ model, solved, theory = false }) => {
  const t = useT();
  if (!model) return null;
  return (
    <div className={`model-panel model-${model.kind} ${solved ? 'model-solved' : ''} ${theory ? 'theory-model' : ''}`}>
      <div className="model-heading">
        <span>{t(model.badge)}</span>
        {model.kind === 'city' && <i aria-hidden="true">● ● ●</i>}
      </div>
      {model.number && <div className="model-number">{t(model.number)}</div>}
      {model.groups && (
        <div className="class-groups">
          {model.groups.map((group, index) => (
            <div className={`class-group group-${group.tone ?? (index ? 'accent' : 'cyan')}`} key={`${t(group.value)}-${index}`} style={{ '--reveal-i': index }}>
              <strong>{t(group.value)}</strong><span>{t(group.label)}</span>
            </div>
          ))}
        </div>
      )}
      {model.columns && (
        <div className="place-table" style={{ gridTemplateColumns: `repeat(${model.columns.length}, minmax(0, 1fr))` }}>
          {model.columns.map((column, index) => (
            <div className="place-cell" key={`${t(column.value)}-${index}`} style={{ '--reveal-i': index }}>
              <span>{t(column.label)}</span><strong>{t(column.value)}</strong>
            </div>
          ))}
        </div>
      )}
      {model.rows && (
        <div className="model-rows">
          {model.rows.map((row, index) => (
            <div key={`${t(row.value)}-${index}`} style={{ '--reveal-i': index }}><span>{t(row.label)}</span><strong>{t(row.value)}</strong></div>
          ))}
        </div>
      )}
      {model.steps && (
        <ol className="model-steps">
          {model.steps.map((step, index) => <li key={`${t(step)}-${index}`} style={{ '--reveal-i': index }}>{t(step)}</li>)}
        </ol>
      )}
    </div>
  );
};

const NavBack = ({ onClick, hidden = false }) => {
  const lang = useLang();
  return hidden ? <span /> : (
    <button type="button" className="btn btn-ghost" onClick={onClick}>
      <span aria-hidden="true">←</span> {lang === 'uz' ? 'Orqaga' : 'Назад'}
    </button>
  );
};

const NavNext = ({ onClick, disabled, finish = false, label }) => {
  const lang = useLang();
  return (
    <button type="button" className={`btn btn-white-accent ${!disabled ? 'btn-ready' : ''}`} disabled={FREE_NAV ? false : disabled} onClick={onClick}>
      {label ?? (finish ? (lang === 'uz' ? 'Darsni yakunlash' : 'Завершить урок') : (lang === 'uz' ? 'Davom etish' : 'Дальше'))}
      <span aria-hidden="true">{finish ? '✓' : '→'}</span>
    </button>
  );
};

const THEORY_BIT_STATES = [
  'awkward', 'point', 'idea', 'point', 'focus', 'think', 'focus', 'idea',
  'present', 'point', 'idea', 'think', 'awkward', 'present', 'happy',
];

const formatTheoryResult = (value, t) => {
  const localized = t(value);
  if (/^\d{6}$/.test(localized)) return `${localized.slice(0, 3)} ${localized.slice(3)}`;
  return localized;
};

const TheoryCallout = ({ screen, result, children, tone = 'cyan' }) => {
  const lang = useLang();
  return (
    <section className={`theory-callout theory-callout-${tone}`} style={{ '--reveal-i': screen % 4 }}>
      <div className="theory-callout-mark" aria-hidden="true">{tone === 'warn' ? '!' : '✓'}</div>
      <div className="theory-callout-copy">
        <span>{lang === 'uz' ? 'TUSHUNTIRISH' : 'ОБЪЯСНЕНИЕ'}</span>
        {result && <strong>{result}</strong>}
        <p>{children}</p>
      </div>
    </section>
  );
};

const DEEP_SCREEN_COPY = {
  position: {
    title: { ru: 'От записи числа к месту цифры', uz: "Son yozuvidan raqam o'rniga" },
    lead: {
      ru: 'Сначала восстанавливаем точную запись, затем смотрим не на размер цифры, а на её позицию.',
      uz: "Avval aniq yozuvni tiklaymiz, keyin raqamning kattaligiga emas, uning o'rniga qaraymiz.",
    },
  },
  values: {
    title: { ru: 'Одинаковые цифры — три разных значения', uz: 'Bir xil raqamlar, uch xil qiymat' },
    lead: {
      ru: 'Разрядная таблица и развёрнутая запись показывают одну закономерность с двух сторон.',
      uz: "Xona jadvali va yoyiq yozuv bitta qonuniyatni ikki tomondan ko'rsatadi.",
    },
  },
  expansion: {
    title: { ru: 'От одной цифры к составу всего числа', uz: 'Bitta raqamdan butun son tarkibiga' },
    lead: {
      ru: 'Определяем значение выбранной цифры, а затем тем же способом раскрываем все ненулевые разряды.',
      uz: "Tanlangan raqam qiymatini aniqlaymiz, keyin shu usul bilan barcha noldan farqli xonalarni ochamiz.",
    },
  },
  zeros: {
    title: { ru: 'Ноль исчезает из суммы, но не из записи', uz: "Nol yig'indida ko'rinmaydi, yozuvda esa qoladi" },
    lead: {
      ru: 'Сопоставим развёрнутую и обычную формы: пустое слагаемое не пишем, пустой разряд обязательно сохраняем.',
      uz: "Yoyiq va oddiy shakllarni solishtiramiz: bo'sh qo'shiluvchini yozmaymiz, bo'sh xonani esa albatta saqlaymiz.",
    },
  },
};

const DeepSequenceScreen = ({ screen, copyKey, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const contents = CONTENT[`s${screen}`].parts;
  const copy = DEEP_SCREEN_COPY[copyKey];
  const [activeStep, setActiveStep] = useState(0);
  const [seenSteps, setSeenSteps] = useState(() => new Set([0]));
  const active = contents[activeStep];
  const segments = useMemo(
    () => [
      ...localizedSegments(active.audio?.intro ?? active.audio, lang, `s${screen}-deep-${activeStep}-intro`),
      ...localizedSegments(active.audio?.on_correct, lang, `s${screen}-deep-${activeStep}-result`),
    ],
    [active, activeStep, lang, screen],
  );
  const audio = useAudio(segments);
  const canContinue = useTheoryAdvanceGate(audio) && seenSteps.size >= contents.length;

  const selectStep = (index) => {
    setActiveStep(index);
    setSeenSteps((previous) => {
      if (previous.has(index)) return previous;
      const next = new Set(previous);
      next.add(index);
      return next;
    });
  };

  const resultSource = active.correctValue ?? active.options?.[active.correctIndex];
  const result = resultSource ? formatTheoryResult(resultSource, t) : '';
  return (
    <Stage
      screen={screen}
      eyebrow={active.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canContinue} /></>}
    >
      <div className="screen-stack deep-sequence-screen">
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">LUMO CITY · DEEP DIVE</span>
            <h1>{t(copy.title)}</h1>
            <p>{t(copy.lead)}</p>
          </div>
          <div className={`bit-coach bit-coach-${activeStep === contents.length - 1 ? 'idea' : 'point'}`}>
            <BitSVG state={activeStep === contents.length - 1 ? 'idea' : 'point'} />
          </div>
        </div>
        <div className="deep-sequence-tabs" role="tablist" aria-label={t(copy.title)}>
          {contents.map((item, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeStep === index}
              className={activeStep === index ? 'deep-tab-active' : seenSteps.has(index) ? 'deep-tab-seen' : ''}
              onClick={() => selectStep(index)}
              key={`s${screen}-part-${index}`}
            >
              <span>{String(index + 1).padStart(2, '0')}</span><strong>{t(item.title)}</strong>
            </button>
          ))}
        </div>
        <div className="deep-sequence-stage" key={`${copyKey}-${activeStep}`}>
          <ModelPanel model={active.model} theory />
          <section className="deep-sequence-explanation">
            <span>{lang === 'uz' ? `${activeStep + 1}-QADAM` : `ШАГ ${activeStep + 1}`}</span>
            <h2>{t(active.instruction)}</h2>
            {result && <strong>{result}</strong>}
            <p>{t(active.correctText)}</p>
          </section>
        </div>
        <div className="deep-contrast-row">
          {contents.map((item, index) => (
            <article className={seenSteps.has(index) ? 'deep-insight-visible' : ''} key={`s${screen}-part-${index}-insight`}>
              <span>{lang === 'uz' ? `KONTRAST ${index + 1}` : `КОНТРАСТ ${index + 1}`}</span>
              <strong>{t(item.options?.[1])}</strong>
              <p>{t(item.wrong?.[1] ?? item.correctText)}</p>
            </article>
          ))}
        </div>
        <button type="button" className="deep-replay" onClick={() => selectStep(activeStep < contents.length - 1 ? activeStep + 1 : 0)}>
          <span aria-hidden="true">{activeStep < contents.length - 1 ? '→' : '↻'}</span>
          {activeStep < contents.length - 1
            ? (lang === 'uz' ? "Keyingi modelni ko'rish" : 'Показать следующую модель')
            : (lang === 'uz' ? "Bosqichlarni yana ko'rish" : 'Показать цепочку ещё раз')}
        </button>
      </div>
    </Stage>
  );
};

const PlaceValueLadderScreen = ({ screen, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[`s${screen}`];
  const segments = useMemo(
    () => localizedSegments(c.audio, lang, `s${screen}-ladder`),
    [c.audio, lang, screen],
  );
  const audio = useAudio(segments);
  const canContinue = useTheoryAdvanceGate(audio);

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canContinue} /></>}
    >
      <div className="screen-stack ladder-screen">
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">LUMO CITY · PLACE-VALUE LIFT</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className="bit-coach bit-coach-idea"><BitSVG state="idea" /></div>
        </div>

        <section className="place-ladder-board" aria-label={t(c.instruction)}>
          <div className="place-ladder-topline">
            <span>{t(c.instruction)}</span>
            <strong><span aria-hidden="true">←</span> {t(c.direction)}</strong>
          </div>
          <div className="place-ladder-track">
            {c.steps.map((step, index) => (
              <article className="place-ladder-step" key={`${step.value}-${index}`} style={{ '--reveal-i': index }}>
                <span>{t(step.place)}</span>
                <strong>{step.value}</strong>
                <i>{lang === 'uz' ? `${step.digit} raqami` : `цифра ${step.digit}`}</i>
              </article>
            ))}
          </div>
        </section>

        <section className="ladder-contrast-grid">
          {c.contrasts.map((example, index) => (
            <article key={example.number} className={index ? 'ladder-example-shifted' : ''} style={{ '--reveal-i': index }}>
              <div><span>{lang === 'uz' ? `HOLAT ${index + 1}` : `СЛУЧАЙ ${index + 1}`}</span><strong>{example.number}</strong></div>
              <p>{t(example.place)}</p>
              <b>{example.value}</b>
            </article>
          ))}
        </section>

        <TheoryCallout screen={screen} result="6 000 × 10 = 60 000">{t(c.conclusion)}</TheoryCallout>
      </div>
    </Stage>
  );
};

const ZeroCoefficientScreen = ({ screen, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[`s${screen}`];
  const segments = useMemo(
    () => localizedSegments(c.audio, lang, `s${screen}-zero-contrast`),
    [c.audio, lang, screen],
  );
  const audio = useAudio(segments);
  const canContinue = useTheoryAdvanceGate(audio);

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canContinue} /></>}
    >
      <div className="screen-stack zero-coefficient-screen">
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">LUMO CITY · ZERO LAB</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className="bit-coach bit-coach-think"><BitSVG state="think" /></div>
        </div>

        <section className="zero-place-board" aria-label={t(c.instruction)}>
          <div className="zero-place-heading"><span>{t(c.instruction)}</span><strong>{c.number}</strong></div>
          <div className="zero-place-grid">
            {c.places.map((place, index) => (
              <div className={place.zero ? 'zero-place-empty' : ''} key={`${t(place.label)}-${index}`} style={{ '--reveal-i': index }}>
                <span>{t(place.label)}</span><strong>{place.digit}</strong>
                {place.zero && <i>{lang === 'uz' ? "bo'sh xona" : 'пустой разряд'}</i>}
              </div>
            ))}
          </div>
        </section>

        <section className="zero-contrast-grid">
          <article className="zero-contrast-sum">
            <span>{t(c.sumLabel)}</span>
            <strong>{c.sumWithZeros}</strong>
            <i aria-hidden="true">↓</i>
            <strong>{c.sumCompact}</strong>
            <p>{t(c.sumExplanation)}</p>
          </article>
          <article className="zero-contrast-notation">
            <span>{t(c.notationLabel)}</span>
            <div><strong>{c.number}</strong><i aria-hidden="true">≠</i><strong>{c.brokenNumber}</strong></div>
            <p>{t(c.notationExplanation)}</p>
          </article>
        </section>

        <TheoryCallout screen={screen} result={lang === 'uz' ? "0 qo'shiluvchi ≠ 0 xona" : 'слагаемое 0 ≠ разряд 0'}>
          {t(c.conclusion)}
        </TheoryCallout>
      </div>
    </Stage>
  );
};

const CardSolutionLabScreen = ({ screen, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[`s${screen}`];
  const [replayKey, setReplayKey] = useState(0);
  const segments = useMemo(
    () => localizedSegments(c.audio, lang, `s${screen}-card-lab`),
    [c.audio, lang, screen],
  );
  const audio = useAudio(segments);
  const canContinue = useTheoryAdvanceGate(audio);

  const replaySolution = () => {
    setReplayKey((value) => value + 1);
    if (!audio.muted) audio.replay();
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canContinue} /></>}
    >
      <div className="screen-stack card-lab-screen">
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">LUMO CITY · SOLUTION LAB</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className="bit-coach bit-coach-point"><BitSVG state="point" /></div>
        </div>

        <section className="card-lab-solution" key={replayKey} aria-label={t(c.instruction)}>
          <div className="shuffled-card-zone">
            <div className="card-lab-label"><span>01</span><strong>{lang === 'uz' ? 'ARALASH KARTALAR' : 'ПЕРЕМЕШАННЫЕ КАРТОЧКИ'}</strong></div>
            <div className="value-card-cloud">
              {c.shuffledCards.map((card, index) => (
                <span key={`${card}-${index}`} style={{ '--reveal-i': index }}>{card}</span>
              ))}
            </div>
          </div>

          <div className="card-lab-arrow" aria-hidden="true">↓</div>

          <div className="ordered-card-zone">
            <div className="card-lab-label"><span>02</span><strong>{lang === 'uz' ? "HAR BIR KARTA O'Z XONASIDA" : 'КАЖДАЯ КАРТОЧКА В СВОЁМ РАЗРЯДЕ'}</strong></div>
            <div className="card-place-grid">
              {c.slots.map((slot, index) => (
                <article className={slot.empty ? 'card-place-empty' : ''} key={`${t(slot.place)}-${index}`} style={{ '--reveal-i': index }}>
                  <span>{t(slot.place)}</span><strong>{slot.digit}</strong><i>{t(slot.value)}</i>
                </article>
              ))}
            </div>
          </div>

          <div className="card-lab-result">
            <div className="card-lab-label"><span>03</span><strong>{lang === 'uz' ? 'NATIJA VA TEKSHIRUV' : 'РЕЗУЛЬТАТ И ПРОВЕРКА'}</strong></div>
            <div className="card-result-number">{c.result}</div>
            <div className="card-result-check"><span>{lang === 'uz' ? 'qayta yoyish' : 'обратное разложение'}</span><strong>{c.verification}</strong></div>
          </div>
        </section>

        <section className="card-lab-steps">
          {c.steps.map((step, index) => (
            <article key={`${t(step.label)}-${index}`} style={{ '--reveal-i': index }}><strong>{t(step.label)}</strong><p>{t(step.text)}</p></article>
          ))}
        </section>

        <div className="card-lab-conclusion">
          <TheoryCallout screen={screen} result={c.result}>{t(c.conclusion)}</TheoryCallout>
          <button type="button" className="deep-replay" onClick={replaySolution}><span aria-hidden="true">↻</span> {t(c.replay)}</button>
        </div>
      </div>
    </Stage>
  );
};

const TheoryScreen = ({ screen, contentKey, onNext, onPrev, finishLesson }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[contentKey ?? `s${screen}`];
  const meta = SCREEN_META[screen];
  const isFinal = screen === TOTAL_SCREENS - 1;
  const resultSource = c.correctValue ?? c.options?.[c.correctIndex];
  const result = resultSource ? formatTheoryResult(resultSource, t) : '';
  const segments = useMemo(() => [
    ...localizedSegments(c.audio?.intro ?? c.audio, lang, `s${screen}-intro`),
    ...localizedSegments(c.audio?.on_correct, lang, `s${screen}-explanation`),
  ], [c.audio, lang, screen]);
  const audio = useAudio(segments);
  const canContinue = useTheoryAdvanceGate(audio);
  const isFoundation = meta.template === 'FoundationTheory' || meta.template === 'RecapTheory';
  const isRule = meta.template === 'RuleReveal';
  const isStrategy = meta.template === 'StrategyTheory';
  const isError = meta.template === 'ErrorWalkthrough';
  const isSummary = meta.template === 'SummaryTheory';

  const proceed = () => {
    if (isFinal) finishLesson();
    else onNext();
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} hidden={screen === 0} /><NavNext onClick={proceed} disabled={!canContinue} finish={isFinal} /></>}
    >
      <div className={`screen-stack theory-screen theory-screen-${meta.template.toLowerCase()}`}>
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">LUMO CITY · KNOWLEDGE LAB</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className={`bit-coach bit-coach-${THEORY_BIT_STATES[screen]}`}>
            <BitSVG state={THEORY_BIT_STATES[screen]} />
          </div>
        </div>

        {isFoundation && (
          <div className="foundation-layout">
            <ModelPanel model={c.model} theory />
            <div className="foundation-copy">
              <span>{lang === 'uz' ? 'ASOSIY SAVOL' : 'ГЛАВНЫЙ ВОПРОС'}</span>
              <h2>{t(c.instruction)}</h2>
              <TheoryCallout screen={screen} result={result}>{t(c.correctText)}</TheoryCallout>
            </div>
          </div>
        )}

        {!isFoundation && !isSummary && <ModelPanel model={c.model} theory />}

        {!isFoundation && !isRule && !isStrategy && !isError && !isSummary && (
          <div className="animated-explanation">
            <div className="theory-focus">
              <span>{lang === 'uz' ? 'KUZATUV' : 'НАБЛЮДЕНИЕ'}</span>
              <h2>{t(c.instruction)}</h2>
            </div>
            <TheoryCallout screen={screen} result={result}>{t(c.correctText)}</TheoryCallout>
          </div>
        )}

        {isRule && (
          <section className="rule-reveal">
            <div className="rule-ribbon"><span>1</span><b>{lang === 'uz' ? 'Raqamni toping' : 'Найди цифру'}</b></div>
            <div className="rule-ribbon"><span>2</span><b>{lang === 'uz' ? 'Xonasini aniqlang' : 'Определи разряд'}</b></div>
            <div className="rule-ribbon"><span>3</span><b>{lang === 'uz' ? 'Xona qiymatini yozing' : 'Запиши разрядное значение'}</b></div>
            <div className="rule-ribbon"><span>4</span><b>{lang === 'uz' ? "Yoying yoki qayta tiklang" : 'Разложи или восстанови'}</b></div>
            <TheoryCallout screen={screen} result={result}>{t(c.correctText)}</TheoryCallout>
          </section>
        )}

        {isStrategy && (
          <section className="strategy-walkthrough">
            <div className="strategy-card strategy-recommended">
              <span>{lang === 'uz' ? 'ENG ISHONCHLI' : 'САМЫЙ НАДЁЖНЫЙ'}</span>
              <strong>{t(c.options[c.correctIndex])}</strong>
              <p>{t(c.correctText)}</p>
            </div>
            <div className="strategy-card strategy-valid">
              <span>{lang === 'uz' ? "TO'G'RI, AMMO EHTIYOT BO'LING" : 'ВЕРНО, НО НУЖНА ПРОВЕРКА'}</span>
              <strong>{t(c.options[1])}</strong>
              <p>{t(c.wrong[1])}</p>
            </div>
          </section>
        )}

        {isError && (
          <section className="error-walkthrough">
            <div className="error-state error-before">
              <span>{lang === 'uz' ? 'XATO YOZUV' : 'ОШИБОЧНАЯ ЗАПИСЬ'}</span>
              <strong>{t(c.model.rows[0].value)}</strong>
              <p>{t(c.lead)}</p>
            </div>
            <div className="repair-arrow" aria-hidden="true">→</div>
            <div className="error-state error-after">
              <span>{lang === 'uz' ? 'TUZATISH' : 'ИСПРАВЛЕНИЕ'}</span>
              <strong>{result}</strong>
              <p>{t(c.correctText)}</p>
            </div>
          </section>
        )}

        {isSummary && (
          <section className="summary-theory">
            <div className="summary-core">
              <ModelPanel model={c.model} theory />
              <TheoryCallout screen={screen} result={result} tone="cyan">{t(c.correctText)}</TheoryCallout>
            </div>
            <div className="summary-bridge"><span aria-hidden="true">→</span><p>{t(c.bridge)}</p></div>
          </section>
        )}
      </div>
    </Stage>
  );
};

const WorkedExamplesScreen = ({ screen, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[`s${screen}`];
  const segments = useMemo(() => [
    ...localizedSegments(c.audio.intro, lang, `s${screen}-intro`),
    ...c.items.flatMap((item, index) => [
      ...localizedSegments(item.audio.intro, lang, `s${screen}-example-${index}-question`),
      ...localizedSegments(item.audio.on_correct, lang, `s${screen}-example-${index}-solution`),
    ]),
  ], [c.audio.intro, c.items, lang, screen]);
  const audio = useAudio(segments);
  const canContinue = useTheoryAdvanceGate(audio);

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canContinue} /></>}
    >
      <div className="screen-stack worked-screen">
        <div className="screen-heading compact-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">LUMO CITY · SOLUTION WALL</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className="bit-coach bit-coach-point"><BitSVG state="point" /></div>
        </div>
        <section className="worked-example-grid">
          {c.items.map((item, index) => (
            <article className="worked-example" key={`${t(item.question)}-${index}`} style={{ '--reveal-i': index }}>
              <div className="worked-index">{String(index + 1).padStart(2, '0')}</div>
              <div className="worked-copy">
                <span>{lang === 'uz' ? 'MISOL' : 'ПРИМЕР'}</span>
                <h2>{t(item.question)}</h2>
                <strong>{t(item.options[item.correctIndex])}</strong>
                <p>{t(item.correctText)}</p>
              </div>
            </article>
          ))}
        </section>
        <div className="worked-complete"><BitSVG state="nod" /><p>{t(c.completionText)}</p></div>
      </div>
    </Stage>
  );
};

const ChoiceScreen = ({ screen, contentKey, storedAnswer, onAnswer, onNext, onPrev, finishLesson }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[contentKey ?? `s${screen}`];
  const resetOnReturn = SCREEN_META[screen].resetOnReturn === true;
  const restorableAnswer = resetOnReturn ? null : storedAnswer;
  const restored = restorableAnswer?.solved === true;
  const [picked, setPicked] = useState(restorableAnswer?.studentAnswerIndex ?? null);
  const [solved, setSolved] = useState(restored);
  const [attempts, setAttempts] = useState(restorableAnswer?.attempts ?? 0);
  const [wrongIndices, setWrongIndices] = useState(() => new Set(restorableAnswer?.wrongIndices ?? []));
  const segments = useMemo(
    () => localizedSegments(c.audio?.intro ?? c.audio, lang, `s${screen}`),
    [c.audio, lang, screen],
  );
  const audio = useAudio(segments);
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(solved, audio);
  const isFinal = screen === TOTAL_SCREENS - 1;
  const optionOrder = buildOptionOrder(c.options.length, c.correctIndex, screen);

  const choose = (index) => {
    if (!canAnswer || solved || wrongIndices.has(index)) return;
    const nextAttempts = attempts + 1;
    const correct = index === c.correctIndex;
    setPicked(index);
    setAttempts(nextAttempts);
    if (!correct) {
      const nextWrong = new Set(wrongIndices);
      nextWrong.add(index);
      setWrongIndices(nextWrong);
      playSfx('wrong');
      audio.pushOneOff(t(c.audio?.on_wrong?.[index] ?? c.wrong?.[index]));
      onAnswer({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.instruction),
        options: c.options.map((option) => t(option)),
        correctIndex: c.correctIndex,
        correctAnswer: t(c.options[c.correctIndex]),
        studentAnswerIndex: index,
        studentAnswer: t(c.options[index]),
        correct: false,
        firstTry: false,
        attempts: nextAttempts,
        wrongIndices: [...nextWrong],
        skillTag: SCREEN_META[screen].subtype,
        solved: false,
      });
      return;
    }
    setSolved(true);
    playSfx('correct');
    audio.pushOneOff(t(c.audio?.on_correct ?? c.correctText));
    onAnswer({
      stage: SCREEN_META[screen].scope,
      screenIdx: screen,
      question: t(c.instruction),
      options: c.options.map((option) => t(option)),
      correctIndex: c.correctIndex,
      correctAnswer: t(c.options[c.correctIndex]),
      studentAnswerIndex: index,
      studentAnswer: t(c.options[index]),
      correct: true,
      firstTry: nextAttempts === 1,
      attempts: nextAttempts,
      wrongIndices: [...wrongIndices],
      skillTag: SCREEN_META[screen].subtype,
      solved: true,
    });
  };

  const proceed = () => {
    if (isFinal) finishLesson();
    else onNext();
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} hidden={screen === 0} /><NavNext onClick={proceed} disabled={!canAdvance} finish={isFinal} /></>}
    >
      <div className="screen-stack">
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">LUMO CITY · DATA CENTER</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className="bit-coach"><BitSVG state={solved ? 'happy' : 'present'} /></div>
        </div>
        <ModelPanel model={c.model} solved={solved} />
        <section className="question-card" aria-labelledby={`question-${screen}`}>
          <div className="question-topline">
            <span>{lang === 'uz' ? 'SIZNING QARORINGIZ' : 'ТВОЁ РЕШЕНИЕ'}</span>
            {!canAnswer && <small>{lang === 'uz' ? 'Avval tushuntirishni tinglang' : 'Сначала дослушай объяснение'}</small>}
          </div>
          <h2 id={`question-${screen}`}>{t(c.instruction)}</h2>
          <div className="options-grid">
            {optionOrder.map((sourceIndex, displayIndex) => {
              const option = c.options[sourceIndex];
              const isWrong = wrongIndices.has(sourceIndex);
              const isCorrect = solved && sourceIndex === c.correctIndex;
              return (
                <button
                  type="button"
                  className={`option ${isWrong ? 'option-picked-wrong' : ''} ${isCorrect ? 'option-correct' : ''} ${solved && !isCorrect ? 'option-dismissed' : ''}`}
                  key={`${t(option)}-${sourceIndex}`}
                  disabled={!canAnswer || solved || isWrong}
                  onClick={() => choose(sourceIndex)}
                >
                  <span className="option-letter">{String.fromCharCode(65 + displayIndex)}</span>
                  <span>{t(option)}</span>
                </button>
              );
            })}
          </div>
          <FeedbackBlock show={picked !== null} correct={solved}>
            {t(solved ? c.correctText : c.wrong?.[picked])}
          </FeedbackBlock>
          {solved && c.fact && <div className="fact-card"><strong>{lang === 'uz' ? 'FAKT' : 'ФАКТ'}</strong><p>{t(c.fact)}</p></div>}
          {solved && c.bridge && <div className="bridge-card"><span aria-hidden="true">→</span><p>{t(c.bridge)}</p></div>}
        </section>
      </div>
    </Stage>
  );
};

const sanitizeNumeric = (raw) => String(raw ?? '')
  .replace(/[^\d]/g, '')
  .replace(/^0+(?=\d)/, '')
  .slice(0, 6);

const NumericInputScreen = ({ screen, contentKey, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[contentKey ?? ('s' + screen)];
  const restored = storedAnswer?.solved === true;
  const [value, setValue] = useState(restored ? String(storedAnswer.studentAnswer) : String(storedAnswer?.studentAnswer ?? ''));
  const [solved, setSolved] = useState(restored);
  const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0);
  const [lastWrongValue, setLastWrongValue] = useState(restored ? null : (storedAnswer?.lastWrongValue ?? null));
  const segments = useMemo(
    () => localizedSegments(c.audio.intro, lang, 's' + screen),
    [c.audio.intro, lang, screen],
  );
  const audio = useAudio(segments);
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(solved, audio);

  const submit = () => {
    const normalized = sanitizeNumeric(value);
    if (!canAnswer || solved || !normalized) return;
    const nextAttempts = attempts + 1;
    const correct = normalized === c.correctValue;
    setAttempts(nextAttempts);
    if (!correct) {
      setLastWrongValue(normalized);
      playSfx('wrong');
      audio.pushOneOff(t(c.inputWrongAudio));
      onAnswer({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.instruction),
        options: null,
        correctIndex: null,
        correctAnswer: c.correctValue,
        studentAnswerIndex: null,
        studentAnswer: normalized,
        correct: false,
        firstTry: false,
        attempts: nextAttempts,
        skillTag: SCREEN_META[screen].subtype,
        solved: false,
        lastWrongValue: normalized,
      });
      return;
    }
    setValue(normalized);
    setSolved(true);
    setLastWrongValue(null);
    playSfx('correct');
    audio.pushOneOff(t(c.audio.on_correct));
    onAnswer({
      stage: SCREEN_META[screen].scope,
      screenIdx: screen,
      question: t(c.instruction),
      options: null,
      correctIndex: null,
      correctAnswer: c.correctValue,
      studentAnswerIndex: null,
      studentAnswer: normalized,
      correct: true,
      firstTry: nextAttempts === 1,
      attempts: nextAttempts,
      skillTag: SCREEN_META[screen].subtype,
      solved: true,
      lastWrongValue: null,
    });
  };

  const wrongFeedback = c.wrongByValue?.[lastWrongValue] ?? c.wrongText;

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}
    >
      <div className="screen-stack">
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">LUMO CITY · VALUE CONSOLE</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className="bit-coach"><BitSVG state={solved ? 'happy' : 'present'} /></div>
        </div>
        <ModelPanel model={c.model} solved={solved} />
        <section className="question-card" aria-labelledby={'question-' + screen}>
          <div className="question-topline">
            <span>{lang === 'uz' ? 'JAVOBNI KIRITING' : 'ВВЕДИ ОТВЕТ'}</span>
            {!canAnswer && <small>{lang === 'uz' ? 'Avval tushuntirishni tinglang' : 'Сначала дослушай объяснение'}</small>}
          </div>
          <h2 id={'question-' + screen}>{t(c.instruction)}</h2>
          <div className="input-action-row">
            <input
              type="text"
              inputMode="numeric"
              className={'answer-input ' + (solved ? 'correct' : lastWrongValue !== null ? 'wrong' : '')}
              value={value}
              placeholder={t(c.placeholder)}
              aria-label={t(c.instruction)}
              disabled={solved || !canAnswer}
              onChange={(event) => {
                setValue(sanitizeNumeric(event.target.value));
                setLastWrongValue(null);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') submit();
              }}
            />
            <button
              type="button"
              className={'btn btn-white-accent ' + (value && canAnswer && !solved ? 'btn-ready' : '')}
              disabled={!value || !canAnswer || solved}
              onClick={submit}
            >
              {lang === 'uz' ? 'Tekshirish' : 'Проверить'}
            </button>
          </div>
          <FeedbackBlock show={solved || lastWrongValue !== null} correct={solved}>
            {t(solved ? c.correctText : wrongFeedback)}
          </FeedbackBlock>
        </section>
      </div>
    </Stage>
  );
};

const Screen0 = (props) => <TheoryScreen {...props} contentKey="s0" />;
const Screen1 = (props) => <DeepSequenceScreen {...props} copyKey="position" />;
const Screen2 = (props) => <PlaceValueLadderScreen {...props} />;
const Screen3 = (props) => <DeepSequenceScreen {...props} copyKey="values" />;
const Screen4 = (props) => <DeepSequenceScreen {...props} copyKey="expansion" />;
const Screen5 = (props) => <ZeroCoefficientScreen {...props} />;
const Screen6 = (props) => <DeepSequenceScreen {...props} copyKey="zeros" />;
const Screen7 = (props) => <TheoryScreen {...props} contentKey="s7" />;
const Screen8 = (props) => <NumericInputScreen {...props} contentKey="s8" />;
const Screen9 = (props) => <WorkedExamplesScreen {...props} />;
const Screen10 = (props) => <CardSolutionLabScreen {...props} />;
const Screen11 = (props) => <TheoryScreen {...props} contentKey="s11" />;
const Screen12 = (props) => <TheoryScreen {...props} contentKey="s12" />;
const Screen13 = (props) => <ChoiceScreen {...props} contentKey="s13" />;
const Screen14 = (props) => <TheoryScreen {...props} contentKey="s14" />;

const SCREENS = [
  Screen0,
  Screen1,
  Screen2,
  Screen3,
  Screen4,
  Screen5,
  Screen6,
  Screen7,
  Screen8,
  Screen9,
  Screen10,
  Screen11,
  Screen12,
  Screen13,
  Screen14,
];

export default function Grade4Dars03({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished }) {
  useMobileZoom();
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('ru');
  const lang = langProp || previewLang;
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  configureLesson({
    ttsApiBase: ttsApiBase || '',
    correctSoundUrl: correctSoundUrl || '',
    wrongSoundUrl: wrongSoundUrl || '',
    studentName: safeName,
    voiceGender: voiceGender || 'f',
  });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  // eslint-disable-next-line react-hooks/purity -- duration requires a mount timestamp
  const startTimeRef = useRef(Date.now());
  const finishedRef = useRef(false);

  const recordAnswer = useCallback((data) => {
    setAnswers((previous) => {
      const next = [...previous];
      next[data.screenIdx] = data;
      return next;
    });
  }, []);

  const finishLesson = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const moduleAnswer = answers[8];
    const finalAnswer = answers[13];
    const totalQuestions = 2;
    const moduleScore = moduleAnswer?.firstTry ? 1 : 0;
    const finalScore = finalAnswer?.firstTry ? 1 : 0;
    const correctAnswers = moduleScore + finalScore;
    const scoredAnswers = [moduleAnswer, finalAnswer].filter(Boolean);
    const payload = {
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle[lang] ?? LESSON_META.lessonTitle.ru,
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions,
      correctAnswers,
      scorePercent: totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
      finalScore,
      finalTotal: 1,
      passed: totalQuestions ? correctAnswers / totalQuestions >= 0.6 : false,
      firstTryStats: { total: totalQuestions, firstTryCorrect: correctAnswers },
      attemptsTotal: scoredAnswers.reduce((sum, answer) => sum + (answer.attempts ?? 0), 0),
      skillTags: LESSON_META.skillTags,
      answers: answers.filter(Boolean),
    };
    if (onFinished) onFinished(payload);
    else console.log('[Grade4 Dars03 preview]', payload);
  }, [answers, lang, onFinished]);

  const CurrentScreen = SCREENS[current];
  const next = () => setCurrent((value) => Math.min(value + 1, TOTAL_SCREENS - 1));
  const previous = () => setCurrent((value) => Math.max(value - 1, 0));

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className={`lesson-root ${preview ? 'lesson-root-preview' : ''}`}>
        {preview && (
          <div className="preview-language" aria-label="Preview language">
            {['ru', 'uz'].map((code) => (
              <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <CurrentScreen
          key={current}
          screen={current}
          storedAnswer={answers[current]}
          answers={answers}
          onAnswer={recordAnswer}
          onNext={next}
          onPrev={previous}
          finishLesson={finishLesson}
        />
      </div>
    </LangContext.Provider>
  );
}

const STYLES = `
html:has(.lesson-root),
body:has(.lesson-root),
#root:has(.lesson-root),
.lesson-page:has(.lesson-root),
.lesson-frame:has(.lesson-root) {
  width: 100%;
  height: 100%;
  min-height: 0 !important;
  overflow: hidden !important;
  overscroll-behavior: none;
}
html, body { margin: 0; padding: 0; }
.lesson-root, .lesson-root * { box-sizing: border-box; }
.lesson-root {
  position: fixed;
  inset: 0;
  overflow: clip;
  overscroll-behavior: none;
  contain: strict;
  isolation: isolate;
  font-family: 'Manrope', system-ui, sans-serif;
  color: ${T.ink};
  background:
    radial-gradient(circle at 10% 14%, rgba(22,143,163,.12), transparent 30%),
    radial-gradient(circle at 90% 84%, rgba(255,91,53,.10), transparent 32%),
    linear-gradient(145deg, #F7F8F4 0%, #EEF3F1 100%);
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "ss01","cv11";
  zoom: var(--g4z, 1);
}
.lesson-root h1, .lesson-root h2, .lesson-root h3,
.lesson-root p, .lesson-root ol { margin: 0; padding: 0; }
.lesson-root button { font: inherit; }
.preview-language {
  position: fixed;
  z-index: 20;
  top: 12px;
  right: 14px;
  display: flex;
  padding: 3px;
  gap: 2px;
  border-radius: 12px;
  background: rgba(255,255,255,.92);
  box-shadow: 0 8px 22px -8px rgba(${T.shadowBase},.28);
  backdrop-filter: blur(10px);
}
.preview-language button {
  min-width: 44px;
  min-height: 44px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: ${T.ink2};
  cursor: pointer;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: .08em;
}
.preview-language button.preview-active { background: ${T.navy}; color: ${T.paper}; }
.stage {
  width: min(936px, 100%);
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: rgba(245,245,240,.86);
  box-shadow: 0 0 50px -24px rgba(${T.shadowBase},.28);
}
.stage-header {
  flex: 0 0 auto;
  padding-top: 10px;
  padding-bottom: 8px;
  background: rgba(245,245,240,.94);
  backdrop-filter: blur(14px);
  z-index: 3;
}
.progress-track {
  width: 100%;
  height: 6px;
  margin-bottom: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(135,148,157,.22);
}
.progress-bar {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, ${T.cyan}, ${T.accent});
  box-shadow: 0 0 12px rgba(255,91,53,.42);
  transition: width .45s ease;
}
.stage-chrome, .chrome-title, .chrome-actions, .audio-controls {
  display: flex;
  align-items: center;
}
.stage-chrome { justify-content: space-between; gap: 14px; }
.chrome-title { gap: 9px; min-width: 0; color: ${T.ink2}; font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
.chrome-title > span:last-child { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.status-dot { width: 8px; height: 8px; flex: 0 0 auto; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 9px rgba(255,91,53,.65); }
.chrome-actions { gap: 9px; flex: 0 0 auto; }
.screen-type, .screen-count {
  min-height: 28px;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .06em;
}
.screen-type { padding: 0 11px; color: ${T.cyan}; background: ${T.cyanSoft}; }
.screen-count { font-family: 'JetBrains Mono', monospace; color: ${T.ink2}; }
.audio-controls { gap: 5px; }
.icon-btn {
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 12px;
  background: ${T.paper};
  color: ${T.navy};
  cursor: pointer;
  box-shadow: 0 6px 16px -7px rgba(${T.shadowBase},.24);
  transition: transform .2s ease, box-shadow .2s ease;
}
.icon-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 20px -8px rgba(${T.shadowBase},.30); }
.stage-content {
  flex: 1 1 auto;
  min-height: 0;
  padding-top: 16px;
  padding-bottom: 28px;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(135,148,157,.35) transparent;
}
.stage-nav {
  flex: 0 0 auto;
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 10px;
  padding-bottom: max(10px, env(safe-area-inset-bottom));
  background: rgba(245,245,240,.97);
  box-shadow: 0 -12px 28px -25px rgba(${T.shadowBase},.45);
  z-index: 3;
}
.btn {
  min-height: 48px;
  padding: 0 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 0;
  border-radius: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: transform .2s ease, color .2s ease, background .2s ease, box-shadow .2s ease, opacity .2s ease;
}
.btn-ghost { color: ${T.ink}; background: transparent; }
.btn-ghost:hover { background: ${T.paper}; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},.28); }
.btn-white-accent {
  margin-left: auto;
  color: ${T.accent};
  background: ${T.paper};
  box-shadow: 0 8px 22px -6px rgba(255,91,53,.30), 0 0 0 1px rgba(255,91,53,.12);
}
.btn-white-accent.btn-ready { color: ${T.paper}; background: ${T.accent}; box-shadow: 0 12px 28px -12px rgba(255,91,53,.65); animation: ready-pulse 1.6s ease-in-out infinite; }
.btn-white-accent.btn-ready:hover { transform: translateY(-1px); box-shadow: 0 12px 28px -6px rgba(255,91,53,.50); }
@keyframes ready-pulse { 50% { transform: scale(1.035); box-shadow: 0 14px 32px -10px rgba(255,91,53,.68); } }
.btn:disabled { opacity: .42; cursor: not-allowed; transform: none; box-shadow: none; }
.screen-stack {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: clamp(12px, 2vw, 18px);
  animation: screen-in .5s cubic-bezier(.22,.8,.3,1) both;
}
@keyframes screen-in {
  from { opacity: 0; transform: translateY(16px) scale(.99); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.screen-heading { display: grid; grid-template-columns: minmax(0,1fr) 118px; align-items: center; gap: 20px; }
.heading-copy { min-width: 0; }
.lesson-kicker {
  display: inline-block;
  margin-bottom: 8px;
  color: ${T.cyan};
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .15em;
}
.heading-copy h1 {
  max-width: 760px;
  font-family: 'Source Serif 4', serif;
  font-size: clamp(29px, 4.6vw, 47px);
  line-height: 1.04;
  letter-spacing: -.025em;
  font-weight: 650;
}
.heading-copy p { max-width: 720px; margin-top: 10px; color: ${T.ink2}; font-size: 15px; line-height: 1.52; }
.bit-coach { width: 118px; height: 118px; display: flex; align-items: center; justify-content: center; border-radius: 28px; background: rgba(255,255,255,.66); box-shadow: 0 12px 26px -16px rgba(${T.shadowBase},.28); }
.bit-coach .g1-char { width: 92px; height: 115px; }
.g1-char {
  display: block;
  height: 100%;
  width: auto;
  overflow: visible;
  filter: drop-shadow(0 6px 12px rgba(58,53,48,.22));
}
.g1-eyes {
  transform-box: fill-box;
  transform-origin: center;
  animation: g4blink 4.4s infinite;
}
@keyframes g4blink {
  0%, 93%, 100% { transform: scaleY(1); }
  96.5% { transform: scaleY(.12); }
}
.g1-bit-ant {
  transform-box: fill-box;
  transform-origin: bottom center;
  animation: g4antbob 2.2s ease-in-out infinite;
}
@keyframes g4antbob {
  0%, 100% { transform: rotate(-10deg); }
  50% { transform: rotate(10deg); }
}
.g1-bit-wave {
  transform-box: fill-box;
  transform-origin: bottom left;
  animation: g4wavebig 1s ease-in-out infinite;
}
@keyframes g4wavebig {
  0%, 100% { transform: rotate(2deg); }
  50% { transform: rotate(-26deg); }
}
.bit-wave-left,
.bit-wave-right,
.bit-think-hand,
.bit-point-arm,
.bit-idea-bulb,
.bit-focus-hands,
.bit-focus-scan,
.bit-nod-hand,
.bit-nod-check {
  transform-box: fill-box;
  transform-origin: center;
}
.bit-double-wave .bit-wave-left { transform-origin: bottom right; animation: bit-wave-left 1.05s ease-in-out infinite; }
.bit-double-wave .bit-wave-right { transform-origin: bottom left; animation: bit-wave-right 1.05s ease-in-out infinite; }
.bit-think-hand { animation: bit-think-tap 1.8s ease-in-out infinite; }
.bit-point-arm { transform-origin: left center; animation: bit-point 1.45s ease-in-out infinite; }
.bit-point-target { transform-box: fill-box; transform-origin: center; animation: bit-target 1.45s ease-in-out infinite; }
.bit-idea-bulb { animation: bit-idea 1.55s ease-in-out infinite; }
.bit-focus-hands { transform-origin: center bottom; animation: bit-focus 1.7s ease-in-out infinite; }
.bit-focus-scan { animation: bit-scan 1.7s ease-in-out infinite; }
.bit-nod-hand { animation: bit-nod-hand 1.35s ease-in-out infinite; }
.bit-nod-check { animation: bit-check 1.35s ease-in-out infinite; }
.g1-char-state-awkward .g1-bit-ant {
  transform-box: fill-box;
  transform-origin: center bottom;
  animation: bit-awkward-antenna .7s ease both;
}
.g1-char-state-awkward .bit-awkward-face { animation: bit-awkward-blink 1.4s ease-in-out 2; }
@keyframes bit-wave-left { 0%, 100% { transform: rotate(2deg); } 50% { transform: rotate(25deg); } }
@keyframes bit-wave-right { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(-25deg); } }
@keyframes bit-think-tap { 0%, 100% { transform: translate(0, 0) rotate(0); } 50% { transform: translate(-2px, -3px) rotate(-7deg); } }
@keyframes bit-point { 0%, 100% { transform: translateX(0) rotate(0); } 48% { transform: translateX(4px) rotate(-5deg); } }
@keyframes bit-target { 0%, 100% { opacity: .38; transform: scale(.72); } 50% { opacity: 1; transform: scale(1.1); } }
@keyframes bit-idea { 0%, 100% { opacity: .72; transform: translateY(1px) scale(.9); } 50% { opacity: 1; transform: translateY(-3px) scale(1.08); } }
@keyframes bit-focus { 0%, 100% { transform: scale(.96); } 50% { transform: scale(1.05); } }
@keyframes bit-scan { 0%, 100% { opacity: .42; transform: translateY(-3px); } 50% { opacity: 1; transform: translateY(6px); } }
@keyframes bit-nod-hand { 0%, 100% { transform: rotate(0); } 48% { transform: rotate(-11deg); } }
@keyframes bit-check { 0%, 100% { transform: scale(.86); opacity: .72; } 50% { transform: scale(1.08); opacity: 1; } }
@keyframes bit-awkward-antenna { to { transform: rotate(-13deg) translateY(2px); } }
@keyframes bit-awkward-blink { 45%, 55% { opacity: .55; transform: translateY(1px); } }
.model-panel {
  position: relative;
  padding: 19px;
  overflow: hidden;
  border-radius: 20px;
  background: ${T.navy};
  color: ${T.paper};
  box-shadow: 0 15px 34px -18px rgba(23,59,82,.58);
}
.model-panel::after { content: ''; position: absolute; width: 190px; height: 190px; right: -80px; top: -95px; border-radius: 50%; background: rgba(149,201,61,.12); pointer-events: none; }
.model-heading { position: relative; z-index: 1; display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 13px; color: rgba(255,255,255,.74); font-size: 11px; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; }
.model-heading i { color: ${T.lime}; font-style: normal; letter-spacing: .18em; }
.model-number { position: relative; z-index: 1; font-family: 'JetBrains Mono', monospace; font-size: clamp(31px, 6vw, 52px); font-weight: 800; letter-spacing: .08em; text-align: center; white-space: nowrap; }
.class-groups { position: relative; z-index: 1; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; }
.class-group { min-height: 92px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; border-radius: 15px; background: rgba(255,255,255,.10); }
.class-group strong { font-family: 'JetBrains Mono', monospace; font-size: clamp(28px,5vw,42px); letter-spacing: .08em; }
.class-group span { color: rgba(255,255,255,.74); font-size: 12px; font-weight: 700; }
.group-cyan { box-shadow: inset 0 0 0 2px rgba(22,143,163,.65); }
.group-accent { box-shadow: inset 0 0 0 2px rgba(255,91,53,.68); }
.place-table { position: relative; z-index: 1; display: grid; gap: 7px; }
.place-cell { min-width: 0; min-height: 82px; padding: 8px 4px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; gap: 7px; border-radius: 12px; background: rgba(255,255,255,.10); text-align: center; }
.place-cell span { min-height: 28px; display: flex; align-items: center; color: rgba(255,255,255,.70); font-size: 9px; line-height: 1.15; }
.place-cell strong { font-family: 'JetBrains Mono', monospace; font-size: clamp(21px,3.7vw,31px); }
.model-rows { position: relative; z-index: 1; display: grid; gap: 9px; }
.model-rows > div { min-height: 58px; padding: 9px 14px; display: flex; align-items: center; justify-content: space-between; gap: 14px; border-radius: 13px; background: rgba(255,255,255,.10); }
.model-rows span { color: rgba(255,255,255,.72); font-size: 12px; font-weight: 750; }
.model-rows strong { font-family: 'JetBrains Mono', monospace; font-size: clamp(20px,4vw,29px); }
.model-steps { position: relative; z-index: 1; list-style: none; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 9px; counter-reset: none; }
.model-steps li { min-height: 64px; padding: 11px; display: flex; align-items: center; justify-content: center; border-radius: 12px; background: rgba(255,255,255,.10); text-align: center; font-size: 12px; line-height: 1.35; font-weight: 720; }
.model-solved { box-shadow: 0 15px 34px -18px rgba(34,122,83,.58), inset 0 0 0 2px rgba(149,201,61,.26); }
.theory-model {
  animation: theory-model-in .62s cubic-bezier(.16,1,.3,1) .1s both;
}
.theory-model .model-number,
.theory-model .class-group,
.theory-model .place-cell,
.theory-model .model-rows > div,
.theory-model .model-steps > li {
  animation: theory-item-in .62s cubic-bezier(.16,1,.3,1) both;
  animation-delay: calc(.25s + var(--reveal-i, 0) * .09s);
}
@keyframes theory-model-in {
  from { opacity: 0; transform: translateY(12px) scale(.985); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes theory-item-in {
  from { opacity: 0; transform: translateY(10px) scale(.94); filter: blur(3px); }
  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
.foundation-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-auto-rows: max-content;
  gap: 12px;
  align-items: start;
}
.foundation-layout > .model-panel { min-height: 0; display: block; }
.foundation-copy {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  border: 1px solid rgba(22,143,163,.12);
  border-radius: 20px;
  background: linear-gradient(145deg, ${T.paper}, ${T.cyanSoft});
  box-shadow: 0 14px 30px -22px rgba(${T.shadowBase},.36);
  animation: theory-copy-in .7s cubic-bezier(.16,1,.3,1) .28s both;
}
.foundation-copy > span,
.theory-focus > span,
.theory-callout-copy > span,
.strategy-card > span,
.error-state > span,
.worked-copy > span {
  color: ${T.cyan};
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .13em;
}
.foundation-copy > h2,
.theory-focus > h2 {
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(18px, 2.6vw, 25px);
  font-weight: 650;
  line-height: 1.25;
}
.animated-explanation {
  display: grid;
  grid-template-columns: minmax(220px, .7fr) minmax(0, 1.3fr);
  gap: 12px;
}
.theory-focus {
  min-height: 112px;
  padding: 17px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 7px;
  border-radius: 17px;
  color: ${T.navy};
  background: ${T.accentSoft};
  box-shadow: inset 4px 0 0 ${T.accent};
  animation: theory-copy-in .62s cubic-bezier(.16,1,.3,1) .38s both;
}
.theory-focus > span { color: ${T.accent}; }
.theory-callout {
  min-height: 112px;
  padding: 14px 16px 14px 10px;
  display: grid;
  grid-template-columns: 50px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(34,122,83,.16);
  border-radius: 17px;
  color: ${T.ink};
  background: linear-gradient(135deg, ${T.paper}, ${T.successSoft});
  box-shadow: 0 14px 28px -22px rgba(34,122,83,.48);
  animation: theory-copy-in .68s cubic-bezier(.16,1,.3,1) calc(.5s + var(--reveal-i, 0) * .04s) both;
}
.theory-callout-mark {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  color: ${T.paper};
  background: ${T.success};
  font-family: 'JetBrains Mono', monospace;
  font-size: 20px;
  font-weight: 900;
  box-shadow: 0 8px 18px -10px rgba(34,122,83,.65);
}
.theory-callout-copy { min-width: 0; display: grid; gap: 4px; }
.theory-callout-copy > span { color: ${T.success}; }
.theory-callout-copy > strong {
  color: ${T.navy};
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(15px, 2.4vw, 21px);
  line-height: 1.25;
}
.theory-callout-copy > p { color: ${T.ink2}; font-size: 13px; line-height: 1.45; }
.theory-callout-cyan { border-color: rgba(22,143,163,.16); background: linear-gradient(135deg, ${T.paper}, ${T.cyanSoft}); }
.theory-callout-cyan .theory-callout-mark { background: ${T.cyan}; }
.rule-reveal {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 9px;
}
.rule-ribbon {
  min-height: 86px;
  padding: 12px 10px;
  display: flex;
  align-items: center;
  gap: 9px;
  border-radius: 15px;
  color: ${T.navy};
  background: ${T.paper};
  box-shadow: 0 10px 24px -18px rgba(${T.shadowBase},.36);
  animation: theory-item-in .62s cubic-bezier(.16,1,.3,1) both;
}
.rule-ribbon:nth-child(1) { animation-delay: .18s; }
.rule-ribbon:nth-child(2) { animation-delay: .3s; }
.rule-ribbon:nth-child(3) { animation-delay: .42s; }
.rule-ribbon:nth-child(4) { animation-delay: .54s; }
.rule-ribbon > span {
  width: 31px;
  height: 31px;
  flex: 0 0 31px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  color: ${T.paper};
  background: ${T.cyan};
  font-family: 'JetBrains Mono', monospace;
  font-weight: 900;
}
.rule-ribbon > b { font-size: 12px; line-height: 1.35; }
.rule-reveal > .theory-callout { grid-column: 1 / -1; }
.strategy-walkthrough {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.strategy-card {
  min-height: 154px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 18px;
  animation: theory-copy-in .68s cubic-bezier(.16,1,.3,1) both;
}
.strategy-card > strong { color: ${T.navy}; font-family: 'Source Serif 4', Georgia, serif; font-size: 17px; line-height: 1.32; }
.strategy-card > p { margin-top: auto; color: ${T.ink2}; font-size: 12px; line-height: 1.42; }
.strategy-recommended { border: 1px solid rgba(34,122,83,.2); background: ${T.successSoft}; box-shadow: inset 4px 0 0 ${T.success}; animation-delay: .35s; }
.strategy-recommended > span { color: ${T.success}; }
.strategy-valid { border: 1px solid rgba(169,111,19,.18); background: ${T.warnSoft}; box-shadow: inset 4px 0 0 ${T.warn}; animation-delay: .52s; }
.strategy-valid > span { color: ${T.warn}; }
.error-walkthrough {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 42px minmax(0, 1fr);
  align-items: stretch;
  gap: 10px;
}
.error-state {
  min-height: 150px;
  padding: 17px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 18px;
  animation: theory-copy-in .68s cubic-bezier(.16,1,.3,1) both;
}
.error-state > strong { font-family: 'JetBrains Mono', monospace; font-size: clamp(17px, 2.5vw, 24px); line-height: 1.3; }
.error-state > p { margin-top: auto; font-size: 12px; line-height: 1.43; }
.error-before { color: ${T.warn}; background: ${T.warnSoft}; box-shadow: inset 4px 0 0 ${T.warn}; animation-delay: .3s; }
.error-before > span { color: ${T.warn}; }
.error-after { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 4px 0 0 ${T.success}; animation-delay: .58s; }
.error-after > span { color: ${T.success}; }
.repair-arrow { display: grid; place-items: center; color: ${T.accent}; font-size: 28px; font-weight: 900; animation: repair-arrow-in .7s cubic-bezier(.16,1,.3,1) .46s both; }
@keyframes repair-arrow-in { from { opacity: 0; transform: translateX(-8px) scale(.7); } to { opacity: 1; transform: translateX(0) scale(1); } }
.summary-theory { display: grid; gap: 12px; }
.summary-core { display: grid; grid-template-columns: minmax(0, 1fr); grid-auto-rows: max-content; gap: 12px; align-items: start; }
.summary-core .model-panel, .summary-core .theory-callout { min-height: 0; }
.summary-bridge {
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 15px;
  color: ${T.navy};
  background: ${T.accentSoft};
  animation: theory-copy-in .7s cubic-bezier(.16,1,.3,1) .72s both;
}
.summary-bridge > span { color: ${T.accent}; font-size: 24px; font-weight: 900; }
.summary-bridge p { font-size: 13px; line-height: 1.45; }
.deep-sequence-tabs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
}
.deep-sequence-tabs button {
  min-height: 58px;
  padding: 10px 13px;
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  border: 0;
  border-radius: 15px;
  color: ${T.ink2};
  background: ${T.paper};
  cursor: pointer;
  font-weight: 820;
  line-height: 1.3;
  text-align: left;
  box-shadow: inset 0 0 0 1px rgba(22,143,163,.13), 0 10px 22px -18px rgba(${T.shadowBase},.35);
  transition: transform .2s ease, color .2s ease, background .2s ease, box-shadow .2s ease;
}
.deep-sequence-tabs button:hover { transform: translateY(-1px); }
.deep-sequence-tabs button > span {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font: 900 11px/1 'JetBrains Mono', monospace;
}
.deep-sequence-tabs button strong { min-width: 0; font-size: 12px; line-height: 1.3; }
.deep-sequence-tabs .deep-tab-active {
  color: ${T.navy};
  background: ${T.paper};
  box-shadow: inset 0 0 0 2px rgba(22,143,163,.38), 0 12px 24px -16px rgba(22,143,163,.48);
}
.deep-sequence-tabs .deep-tab-active > span { color: ${T.paper}; background: ${T.cyan}; }
.deep-sequence-tabs .deep-tab-seen > span { color: ${T.navy}; background: ${T.lime}; }
.deep-sequence-stage {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-auto-rows: max-content;
  gap: 10px;
  align-items: start;
  animation: deep-stage-in .62s cubic-bezier(.16,1,.3,1) both;
}
.deep-sequence-stage > .model-panel {
  min-height: 0;
  display: block;
}
.deep-sequence-explanation {
  min-height: 0;
  padding: 19px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 9px;
  border: 1px solid rgba(22,143,163,.15);
  border-radius: 20px;
  background: linear-gradient(145deg, ${T.paper}, ${T.cyanSoft});
  box-shadow: inset 4px 0 0 ${T.cyan}, 0 14px 30px -22px rgba(${T.shadowBase},.38);
}
.deep-sequence-explanation > span,
.deep-contrast-card > span {
  color: ${T.cyan};
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .13em;
  text-transform: uppercase;
}
.deep-sequence-explanation h2 {
  color: ${T.navy};
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(18px, 2.5vw, 25px);
  line-height: 1.25;
  font-weight: 650;
}
.deep-sequence-explanation p { color: ${T.ink2}; font-size: 13px; line-height: 1.47; }
.deep-sequence-explanation strong {
  margin-top: auto;
  padding: 10px 12px;
  border-radius: 12px;
  color: ${T.success};
  background: ${T.successSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(14px, 2.25vw, 19px);
  line-height: 1.35;
}
.deep-contrast-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.deep-contrast-row article {
  min-height: 105px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  border-radius: 16px;
  background: ${T.paper};
  opacity: .2;
  transform: translateY(8px);
  box-shadow: 0 11px 26px -20px rgba(${T.shadowBase},.36);
  transition: opacity .35s ease, transform .35s ease, box-shadow .35s ease;
}
.deep-contrast-row article.deep-insight-visible {
  opacity: 1;
  transform: translateY(0);
  box-shadow: inset 3px 0 0 ${T.success}, 0 11px 26px -20px rgba(${T.shadowBase},.36);
}
.deep-contrast-row article > span { color: ${T.success}; }
.deep-contrast-row article strong { color: ${T.navy}; font-size: 12px; line-height: 1.35; }
.deep-contrast-row article p { margin-top: auto; color: ${T.ink2}; font-size: 12px; line-height: 1.42; }
.deep-replay {
  min-height: 48px;
  padding: 8px 14px;
  justify-self: end;
  border: 0;
  border-radius: 13px;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  cursor: pointer;
  font-weight: 850;
  box-shadow: inset 0 0 0 1px rgba(22,143,163,.15);
}
.deep-replay:hover { transform: translateY(-1px); }
@keyframes deep-stage-in {
  from { opacity: 0; transform: translateY(13px) scale(.985); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.place-ladder-board,
.zero-place-board,
.card-lab-solution {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  color: ${T.paper};
  background:
    radial-gradient(circle at 92% 12%, rgba(149,201,61,.17), transparent 25%),
    linear-gradient(145deg, ${T.navy}, #102F43);
  box-shadow: 0 16px 36px -20px rgba(23,59,82,.62);
  animation: theory-model-in .62s cubic-bezier(.16,1,.3,1) .08s both;
}
.place-ladder-board { padding: 18px; }
.place-ladder-topline,
.zero-place-heading {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}
.place-ladder-topline > span,
.zero-place-heading > span {
  color: rgba(255,255,255,.74);
  font-size: 12px;
  font-weight: 760;
}
.place-ladder-topline > strong {
  flex: 0 0 auto;
  padding: 8px 11px;
  border-radius: 999px;
  color: ${T.navy};
  background: ${T.lime};
  font: 900 10px/1.2 'JetBrains Mono', monospace;
  letter-spacing: .03em;
  animation: ladder-direction-in .72s cubic-bezier(.16,1,.3,1) .54s both;
}
.place-ladder-track {
  position: relative;
  z-index: 1;
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 9px;
}
.place-ladder-step {
  min-height: 126px;
  padding: 12px 9px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border-radius: 16px;
  background: rgba(255,255,255,.10);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.08);
  text-align: center;
  animation: ladder-step-in .68s cubic-bezier(.16,1,.3,1) both;
  animation-delay: calc(.18s + var(--reveal-i, 0) * .13s);
}
.place-ladder-step > span { min-height: 28px; color: rgba(255,255,255,.68); font-size: 10px; font-weight: 760; }
.place-ladder-step > strong { font: 900 clamp(23px,4vw,34px)/1 'JetBrains Mono', monospace; letter-spacing: .04em; }
.place-ladder-step > i { padding: 5px 8px; border-radius: 999px; color: ${T.navy}; background: ${T.cyanSoft}; font-size: 9px; font-style: normal; font-weight: 850; }
.ladder-contrast-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 11px;
}
.ladder-contrast-grid article {
  min-height: 128px;
  padding: 15px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px 14px;
  border-radius: 17px;
  background: ${T.paper};
  box-shadow: inset 4px 0 0 ${T.cyan}, 0 12px 27px -21px rgba(${T.shadowBase},.38);
  animation: theory-copy-in .68s cubic-bezier(.16,1,.3,1) both;
  animation-delay: calc(.5s + var(--reveal-i, 0) * .17s);
}
.ladder-contrast-grid article.ladder-example-shifted { box-shadow: inset 4px 0 0 ${T.accent}, 0 12px 27px -21px rgba(${T.shadowBase},.38); }
.ladder-contrast-grid article > div { min-width: 0; display: grid; gap: 4px; }
.ladder-contrast-grid article > div span { color: ${T.cyan}; font: 900 9px/1.2 'JetBrains Mono', monospace; letter-spacing: .12em; }
.ladder-contrast-grid article > div strong { color: ${T.navy}; font: 900 clamp(19px,3vw,27px)/1.2 'JetBrains Mono', monospace; }
.ladder-contrast-grid article > p { grid-column: 1; color: ${T.ink2}; font-size: 12px; line-height: 1.4; }
.ladder-contrast-grid article > b { grid-column: 2; grid-row: 1 / span 2; color: ${T.success}; font: 900 clamp(20px,3vw,29px)/1.1 'JetBrains Mono', monospace; }
@keyframes ladder-step-in {
  from { opacity: 0; transform: translateX(18px) scale(.92); }
  to { opacity: 1; transform: translateX(0) scale(1); }
}
@keyframes ladder-direction-in {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}
.zero-place-board { padding: 17px; }
.zero-place-heading > strong { color: ${T.paper}; font: 900 clamp(27px,5vw,43px)/1 'JetBrains Mono', monospace; letter-spacing: .08em; }
.zero-place-grid {
  position: relative;
  z-index: 1;
  margin-top: 13px;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 6px;
}
.zero-place-grid > div {
  min-width: 0;
  min-height: 92px;
  padding: 8px 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  border-radius: 13px;
  background: rgba(255,255,255,.10);
  text-align: center;
  animation: theory-item-in .62s cubic-bezier(.16,1,.3,1) both;
  animation-delay: calc(.2s + var(--reveal-i, 0) * .08s);
}
.zero-place-grid > div > span { min-height: 25px; color: rgba(255,255,255,.68); font-size: 8px; line-height: 1.15; }
.zero-place-grid > div > strong { font: 900 clamp(22px,3.8vw,31px)/1 'JetBrains Mono', monospace; }
.zero-place-grid > div > i { min-height: 17px; color: rgba(255,255,255,.55); font-size: 7px; font-style: normal; font-weight: 800; }
.zero-place-grid > div.zero-place-empty { background: rgba(255,91,53,.17); box-shadow: inset 0 0 0 2px rgba(255,91,53,.52); }
.zero-place-grid > div.zero-place-empty > strong { color: #FFD2C7; animation: zero-place-pulse 1.8s ease-in-out infinite; }
.zero-contrast-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 11px;
}
.zero-contrast-grid article {
  min-height: 184px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  border-radius: 18px;
  background: ${T.paper};
  animation: theory-copy-in .68s cubic-bezier(.16,1,.3,1) both;
}
.zero-contrast-grid article > span { font: 900 9px/1.2 'JetBrains Mono', monospace; letter-spacing: .12em; }
.zero-contrast-grid article > strong { overflow-wrap: anywhere; color: ${T.navy}; font: 800 clamp(12px,1.8vw,16px)/1.35 'JetBrains Mono', monospace; }
.zero-contrast-grid article > i { color: ${T.success}; font-size: 20px; font-style: normal; font-weight: 900; text-align: center; }
.zero-contrast-grid article > p { margin-top: auto; color: ${T.ink2}; font-size: 12px; line-height: 1.43; }
.zero-contrast-sum { box-shadow: inset 4px 0 0 ${T.success}, 0 12px 27px -21px rgba(${T.shadowBase},.38); animation-delay: .44s !important; }
.zero-contrast-sum > span { color: ${T.success}; }
.zero-contrast-notation { box-shadow: inset 4px 0 0 ${T.warn}, 0 12px 27px -21px rgba(${T.shadowBase},.38); animation-delay: .62s !important; }
.zero-contrast-notation > span { color: ${T.warn}; }
.zero-contrast-notation > div { display: grid; grid-template-columns: minmax(0,1fr) auto minmax(0,1fr); align-items: center; gap: 8px; }
.zero-contrast-notation > div strong { color: ${T.navy}; font: 900 clamp(19px,3.4vw,29px)/1.2 'JetBrains Mono', monospace; text-align: center; }
.zero-contrast-notation > div i { color: ${T.warn}; font-size: 25px; font-style: normal; font-weight: 900; }
@keyframes zero-place-pulse { 50% { color: ${T.paper}; transform: scale(1.12); } }
.card-lab-solution { padding: 17px; display: grid; gap: 11px; }
.shuffled-card-zone,
.ordered-card-zone,
.card-lab-result { position: relative; z-index: 1; display: grid; gap: 10px; }
.card-lab-label { display: flex; align-items: center; gap: 9px; color: rgba(255,255,255,.72); font-size: 9px; letter-spacing: .11em; }
.card-lab-label > span { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 9px; color: ${T.navy}; background: ${T.lime}; font: 900 9px/1 'JetBrains Mono', monospace; }
.value-card-cloud { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.value-card-cloud > span {
  min-height: 44px;
  padding: 8px 13px;
  display: inline-flex;
  align-items: center;
  border-radius: 12px;
  color: ${T.navy};
  background: ${T.paper};
  font: 900 clamp(14px,2.4vw,19px)/1 'JetBrains Mono', monospace;
  box-shadow: 0 8px 18px -11px rgba(0,0,0,.38);
  animation: shuffled-card-in .62s cubic-bezier(.16,1,.3,1) both;
  animation-delay: calc(.16s + var(--reveal-i, 0) * .1s);
}
.value-card-cloud > span:nth-child(odd) { transform: rotate(-1.5deg); }
.value-card-cloud > span:nth-child(even) { transform: rotate(1.5deg); }
.card-lab-arrow { position: relative; z-index: 1; height: 20px; display: grid; place-items: center; color: ${T.lime}; font-size: 22px; font-weight: 900; animation: card-arrow-in .6s cubic-bezier(.16,1,.3,1) .7s both; }
.card-place-grid { display: grid; grid-template-columns: repeat(6, minmax(0,1fr)); gap: 6px; }
.card-place-grid article {
  min-width: 0;
  min-height: 100px;
  padding: 7px 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  border-radius: 12px;
  background: rgba(255,255,255,.10);
  text-align: center;
  animation: ordered-card-in .62s cubic-bezier(.16,1,.3,1) both;
  animation-delay: calc(.78s + var(--reveal-i, 0) * .08s);
}
.card-place-grid article > span { min-height: 25px; color: rgba(255,255,255,.67); font-size: 7px; line-height: 1.15; }
.card-place-grid article > strong { font: 900 clamp(21px,3.5vw,29px)/1 'JetBrains Mono', monospace; }
.card-place-grid article > i { color: rgba(255,255,255,.58); font-size: 7px; font-style: normal; font-weight: 760; }
.card-place-grid article.card-place-empty { background: rgba(255,91,53,.17); box-shadow: inset 0 0 0 2px rgba(255,91,53,.48); }
.card-place-grid article.card-place-empty > strong { color: #FFD2C7; }
.card-lab-result { grid-template-columns: auto minmax(0, .7fr) minmax(260px, 1.3fr); align-items: center; animation: result-lock-in .7s cubic-bezier(.16,1,.3,1) 1.4s both; }
.card-lab-result .card-lab-label { align-self: stretch; }
.card-result-number { padding: 12px 14px; border-radius: 14px; color: ${T.navy}; background: ${T.lime}; font: 900 clamp(24px,4.3vw,38px)/1 'JetBrains Mono', monospace; letter-spacing: .06em; text-align: center; }
.card-result-check { min-width: 0; padding: 11px 13px; display: grid; gap: 4px; border-radius: 14px; background: rgba(255,255,255,.10); }
.card-result-check > span { color: rgba(255,255,255,.62); font-size: 8px; font-weight: 850; letter-spacing: .09em; text-transform: uppercase; }
.card-result-check > strong { overflow-wrap: anywhere; font: 800 clamp(11px,1.8vw,15px)/1.35 'JetBrains Mono', monospace; }
.card-lab-steps { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 9px; }
.card-lab-steps article { min-height: 110px; padding: 14px; display: flex; flex-direction: column; gap: 7px; border-radius: 16px; background: ${T.paper}; box-shadow: 0 11px 26px -20px rgba(${T.shadowBase},.36); animation: theory-item-in .62s cubic-bezier(.16,1,.3,1) both; animation-delay: calc(.28s + var(--reveal-i, 0) * .13s); }
.card-lab-steps article > strong { color: ${T.cyan}; font-size: 12px; }
.card-lab-steps article > p { margin-top: auto; color: ${T.ink2}; font-size: 11px; line-height: 1.42; }
.card-lab-conclusion { display: grid; grid-template-columns: minmax(0,1fr) auto; align-items: end; gap: 10px; }
.card-lab-conclusion .deep-replay { white-space: nowrap; }
@keyframes shuffled-card-in { from { opacity: 0; transform: translate(18px,-10px) rotate(6deg) scale(.82); } to { opacity: 1; transform: translate(0,0) rotate(0) scale(1); } }
@keyframes card-arrow-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes ordered-card-in { from { opacity: 0; transform: translateY(-18px) scale(.88); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes result-lock-in { from { opacity: 0; transform: scale(.95); filter: blur(3px); } to { opacity: 1; transform: scale(1); filter: blur(0); } }
.worked-example-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 11px; }
.worked-example {
  min-height: 174px;
  padding: 14px;
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 11px;
  border: 1px solid rgba(22,143,163,.11);
  border-radius: 17px;
  background: ${T.paper};
  box-shadow: 0 12px 28px -21px rgba(${T.shadowBase},.36);
  animation: theory-item-in .68s cubic-bezier(.16,1,.3,1) both;
  animation-delay: calc(.16s + var(--reveal-i, 0) * .13s);
}
.worked-index { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 13px; color: ${T.paper}; background: ${T.navy}; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 900; }
.worked-copy { min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.worked-copy h2 { font-family: 'Source Serif 4', Georgia, serif; font-size: 15px; line-height: 1.3; font-weight: 650; }
.worked-copy > strong { color: ${T.success}; font-family: 'JetBrains Mono', monospace; font-size: 16px; line-height: 1.3; }
.worked-copy > p { margin-top: auto; color: ${T.ink2}; font-size: 11px; line-height: 1.42; }
.worked-complete { min-height: 76px; padding: 7px 14px 7px 5px; display: flex; align-items: center; justify-content: center; gap: 10px; border-radius: 16px; color: ${T.success}; background: ${T.successSoft}; font-weight: 850; animation: theory-copy-in .68s cubic-bezier(.16,1,.3,1) .78s both; }
.worked-complete .g1-char { width: 55px; height: 68px; }
@keyframes theory-copy-in {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}
.question-card { padding: 22px; border-radius: 20px; background: ${T.paper}; box-shadow: 0 12px 30px -18px rgba(${T.shadowBase},.30); }
.question-topline { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 8px; color: ${T.accent}; font-size: 10px; font-weight: 900; letter-spacing: .14em; }
.question-topline small { color: ${T.warn}; font-size: 10px; letter-spacing: 0; }
.question-card h2 { max-width: 780px; font-family: 'Source Serif 4', serif; font-size: clamp(21px,3.2vw,30px); line-height: 1.18; font-weight: 620; }
.input-action-row {
  margin-top: 16px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
}
.answer-input {
  width: 100%;
  min-width: 0;
  min-height: 58px;
  padding: 10px 16px;
  border: 0;
  border-radius: 14px;
  outline: none;
  background: #F8F8F4;
  color: #12212C;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(23px, 4vw, 31px);
  font-weight: 800;
  letter-spacing: .08em;
  box-shadow: inset 0 0 0 1px rgba(135,148,157,.16), 0 6px 16px -10px rgba(58,53,48,.22);
  transition: background .18s ease, color .18s ease, box-shadow .18s ease;
}
.answer-input:focus {
  box-shadow: 0 10px 24px -10px rgba(255,91,53,.34), 0 0 0 3px rgba(22,143,163,.24);
}
.answer-input.wrong {
  color: #A96F13;
  background: #FFF5D9;
  box-shadow: inset 0 0 0 2px rgba(169,111,19,.28);
}
.answer-input.correct {
  color: #227A53;
  background: #E7F3EC;
  box-shadow: inset 0 0 0 2px rgba(34,122,83,.28), 0 8px 20px -12px rgba(34,122,83,.35);
}
.options-grid { margin-top: 16px; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }
.option {
  min-height: 58px;
  padding: 11px 14px;
  display: flex;
  align-items: center;
  gap: 11px;
  border: 0;
  border-radius: 14px;
  background: #F8F8F4;
  color: ${T.ink};
  cursor: pointer;
  text-align: left;
  line-height: 1.34;
  box-shadow: inset 0 0 0 1px rgba(135,148,157,.16), 0 6px 16px -10px rgba(${T.shadowBase},.22);
  transition: transform .18s ease, background .18s ease, box-shadow .18s ease, opacity .18s ease;
}
.option:hover:not(:disabled) { transform: translateY(-1px); background: ${T.accentSoft}; box-shadow: inset 0 0 0 1px rgba(255,91,53,.24), 0 10px 20px -12px rgba(255,91,53,.34); }
.option:disabled { cursor: default; }
.option-letter { width: 32px; height: 32px; flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; border-radius: 10px; background: ${T.paper}; color: ${T.cyan}; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 900; box-shadow: 0 4px 12px -8px rgba(${T.shadowBase},.3); }
.option-picked-wrong { color: ${T.warn}; background: ${T.warnSoft}; box-shadow: inset 0 0 0 2px rgba(169,111,19,.28); opacity: .64; }
.option-correct { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 0 0 0 2px rgba(34,122,83,.28), 0 8px 20px -12px rgba(34,122,83,.35); }
.option-correct .option-letter { color: ${T.paper}; background: ${T.success}; }
.option-dismissed { opacity: .42; }
.feedback { max-height: 0; margin-top: 0; overflow: hidden; opacity: 0; transition: max-height .38s ease, margin-top .38s ease, opacity .28s ease; }
.feedback-visible { max-height: 420px; margin-top: 14px; opacity: 1; }
.feedback-card { min-height: 94px; padding: 12px 15px 12px 7px; display: grid; grid-template-columns: 82px minmax(0,1fr); align-items: center; gap: 10px; border-radius: 15px; }
.feedback-card .g1-char { width: 76px; height: 92px; }
.feedback-card strong { display: block; margin-bottom: 5px; font-family: 'Source Serif 4', serif; font-size: 13px; letter-spacing: .08em; }
.feedback-card p { color: ${T.ink2}; font-size: 13px; line-height: 1.45; }
.feedback-correct { background: ${T.successSoft}; box-shadow: inset 4px 0 0 ${T.success}; }
.feedback-correct strong { color: ${T.success}; }
.feedback-hint { background: ${T.warnSoft}; box-shadow: inset 4px 0 0 ${T.warn}; }
.feedback-hint strong { color: ${T.warn}; }
.fact-card, .bridge-card { margin-top: 12px; padding: 13px 15px; display: flex; align-items: flex-start; gap: 11px; border-radius: 13px; }
.fact-card { background: ${T.cyanSoft}; color: ${T.cyan}; }
.fact-card strong { font-size: 10px; letter-spacing: .14em; }
.fact-card p, .bridge-card p { color: ${T.ink2}; font-size: 13px; line-height: 1.42; }
.bridge-card { background: ${T.accentSoft}; }
.bridge-card > span { color: ${T.accent}; font-weight: 900; }
.compact-heading { grid-template-columns: minmax(0,1fr) auto; }
.lesson-root button:focus-visible { outline: 3px solid rgba(22,143,163,.42); outline-offset: 3px; }
@media (max-width: 760px) {
  .screen-heading { grid-template-columns: minmax(0,1fr) 94px; }
  .bit-coach { width: 94px; height: 102px; }
  .bit-coach .g1-char { width: 78px; height: 100px; }
  .place-ladder-track { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .card-lab-result { grid-template-columns: 1fr 1fr; }
  .card-lab-result .card-lab-label { grid-column: 1 / -1; }
  .rule-reveal { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .options-grid { grid-template-columns: 1fr; }
}
@media (max-width: 639.98px) {
  .lesson-root { width: 390px; }
  .stage { width: 390px; }
  .stage-header { padding-top: 10px; padding-bottom: 8px; }
  .stage-content { padding-top: 10px; padding-bottom: 18px; scrollbar-width: none; }
  .stage-content::-webkit-scrollbar { display: none; }
  .stage-nav { min-height: 66px; padding-top: 8px; }
  .screen-type { display: none; }
  .chrome-title { max-width: 170px; font-size: 10px; }
  .icon-btn { width: 48px; height: 48px; }
  .screen-stack { gap: 12px; }
  .screen-heading { grid-template-columns: minmax(0,1fr) 76px; gap: 8px; }
  .heading-copy h1 { font-size: 27px; }
  .heading-copy p { margin-top: 7px; font-size: 13px; line-height: 1.4; }
  .lesson-kicker { margin-bottom: 5px; font-size: 9px; }
  .bit-coach { width: 76px; height: 82px; border-radius: 20px; }
  .bit-coach .g1-char { width: 62px; height: 78px; }
  .model-panel { padding: 13px; border-radius: 16px; }
  .model-heading { margin-bottom: 9px; font-size: 9px; }
  .model-number { font-size: 30px; }
  .class-groups { gap: 7px; }
  .class-group { min-height: 72px; }
  .class-group strong { font-size: 27px; }
  .class-group span { font-size: 10px; }
  .place-table { gap: 4px; }
  .place-cell { min-height: 94px; padding: 7px 2px; }
  .place-cell span { min-height: 38px; font-size: 11px; line-height: 1.12; }
  .place-cell strong { font-size: 20px; }
  .model-steps { grid-template-columns: 1fr; gap: 5px; }
  .model-steps li { min-height: 42px; padding: 8px; }
  .foundation-layout, .animated-explanation, .strategy-walkthrough, .summary-core, .worked-example-grid { grid-template-columns: 1fr; }
  .deep-sequence-tabs, .deep-contrast-row { grid-template-columns: 1fr; }
  .deep-sequence-tabs { gap: 6px; }
  .deep-sequence-tabs button { min-height: 52px; padding: 8px 10px; }
  .deep-sequence-stage { gap: 9px; }
  .deep-sequence-stage > .model-panel, .deep-sequence-explanation { min-height: 0; }
  .deep-sequence-explanation { padding: 14px; border-radius: 16px; }
  .deep-contrast-row article { min-height: 0; padding: 12px; }
  .deep-replay { width: 100%; min-height: 52px; justify-self: stretch; }
  .place-ladder-board, .zero-place-board, .card-lab-solution { padding: 13px; border-radius: 16px; }
  .place-ladder-topline, .zero-place-heading { align-items: flex-start; }
  .place-ladder-topline { flex-direction: column; gap: 8px; }
  .place-ladder-topline > strong { align-self: stretch; text-align: center; }
  .place-ladder-track { margin-top: 10px; gap: 6px; }
  .place-ladder-step { min-height: 118px; padding: 9px 6px; }
  .place-ladder-step > span { min-height: 34px; font-size: 11px; line-height: 1.15; }
  .place-ladder-step > strong { font-size: 25px; }
  .place-ladder-step > i { font-size: 11px; }
  .ladder-contrast-grid, .zero-contrast-grid { grid-template-columns: 1fr; }
  .ladder-contrast-grid article { min-height: 108px; padding: 12px; }
  .zero-place-heading > span { max-width: 190px; font-size: 11px; }
  .zero-place-heading > strong { font-size: 28px; }
  .zero-place-grid { margin-top: 10px; gap: 3px; }
  .zero-place-grid > div { min-height: 114px; padding: 7px 2px; border-radius: 10px; }
  .zero-place-grid > div > span { min-height: 39px; font-size: 11px; line-height: 1.12; overflow-wrap: anywhere; }
  .zero-place-grid > div > strong { font-size: 21px; }
  .zero-place-grid > div > i { min-height: 28px; font-size: 11px; line-height: 1.12; overflow-wrap: anywhere; }
  .zero-contrast-grid article { min-height: 0; padding: 13px; }
  .zero-contrast-notation > div strong { font-size: 21px; }
  .card-lab-solution { gap: 8px; }
  .card-lab-label { font-size: 11px; line-height: 1.25; }
  .card-lab-label > span { width: 32px; height: 32px; font-size: 11px; }
  .value-card-cloud { gap: 5px; }
  .value-card-cloud > span { min-height: 44px; padding: 7px 10px; font-size: 14px; }
  .card-place-grid { gap: 3px; }
  .card-place-grid article { min-height: 118px; padding: 7px 2px; border-radius: 9px; }
  .card-place-grid article > span { min-height: 39px; font-size: 11px; line-height: 1.12; overflow-wrap: anywhere; }
  .card-place-grid article > strong { font-size: 20px; }
  .card-place-grid article > i { min-height: 27px; font-size: 11px; line-height: 1.12; overflow-wrap: anywhere; }
  .card-lab-result { grid-template-columns: 1fr; }
  .card-lab-result .card-lab-label { grid-column: auto; }
  .card-result-number { font-size: 28px; }
  .card-result-check > span { font-size: 11px; }
  .card-lab-steps, .card-lab-conclusion { grid-template-columns: 1fr; }
  .card-lab-steps { gap: 6px; }
  .card-lab-steps article { min-height: 0; padding: 11px; }
  .card-lab-conclusion .deep-replay { white-space: normal; }
  .foundation-copy { padding: 14px; border-radius: 16px; }
  .foundation-copy > h2, .theory-focus > h2 { font-size: 19px; }
  .theory-focus, .theory-callout { min-height: 0; }
  .theory-focus { padding: 13px; }
  .theory-callout { padding: 11px 12px 11px 8px; grid-template-columns: 42px minmax(0, 1fr); }
  .theory-callout-mark { width: 36px; height: 36px; border-radius: 11px; font-size: 17px; }
  .theory-callout-copy > p { font-size: 12px; }
  .rule-reveal { grid-template-columns: 1fr; gap: 6px; }
  .rule-ribbon { min-height: 54px; padding: 8px; }
  .strategy-card { min-height: 0; padding: 14px; }
  .error-walkthrough { grid-template-columns: 1fr; gap: 7px; }
  .error-state { min-height: 0; padding: 14px; }
  .repair-arrow { min-height: 28px; font-size: 0; }
  .repair-arrow::before { content: '↓'; font-size: 24px; }
  .summary-core .model-panel, .summary-core .theory-callout { min-height: 0; }
  .summary-bridge { padding: 11px 13px; }
  .worked-example { min-height: 0; padding: 11px; grid-template-columns: 36px minmax(0, 1fr); }
  .worked-index { width: 36px; height: 36px; }
  .worked-complete { min-height: 66px; }
  .worked-complete .g1-char { width: 47px; height: 58px; }
  .question-card { padding: 14px; border-radius: 16px; }
  .question-card h2 { font-size: 20px; }
  .input-action-row { margin-top: 11px; gap: 8px; }
  .answer-input { min-height: 50px; font-size: 23px; padding: 8px 11px; }
  .options-grid { margin-top: 11px; gap: 7px; }
  .option { min-height: 50px; padding: 8px 10px; font-size: 12px; }
  .option-letter { width: 29px; height: 29px; }
  .feedback-card { grid-template-columns: 66px minmax(0,1fr); min-height: 80px; padding: 8px 10px 8px 3px; }
  .feedback-card .g1-char { width: 62px; height: 76px; }
  .feedback-card p { font-size: 12px; }
  .btn { min-height: 48px; padding: 0 14px; font-size: 12px; }
  .preview-language button { min-width: 48px; min-height: 48px; }
  .preview-language { top: 7px; right: 7px; }
  .lesson-root-preview .stage-header { padding-top: 66px; }
}
@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
`;
