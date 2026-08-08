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
// 4-SINF · Dars06 · Sonlarning xonalari va sinflari
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

const CONTENT = {
  "s0": {
    "eyebrow": {
      "ru": "Миссия данных",
      "uz": "Ma'lumotlar missiyasi"
    },
    "title": {
      "ru": "Собираем полный пакет Lumo City",
      "uz": "Lumo City uchun to'liq paket yig'amiz"
    },
    "lead": {
      "ru": "Городской центр получил число 704 018. Чтобы открыть маршрут, нужно понять его классы, разряды и связи между представлениями.",
      "uz": "Shahar markazi 704 018 sonini oldi. Yo'nalishni ochish uchun uning sinflari, xonalari va ko'rinishlari orasidagi bog'lanishni tushunish kerak."
    },
    "instruction": {
      "ru": "Какие действия войдут в полный пакет?",
      "uz": "To'liq paketga qaysi harakatlar kiradi?"
    },
    "model": {
      "kind": "city",
      "badge": {
        "ru": "Пакет данных",
        "uz": "Ma'lumotlar paketi"
      },
      "number": "704 018",
      "rows": [
        {
          "label": {
            "ru": "структура",
            "uz": "tuzilishi"
          },
          "value": {
            "ru": "КЛАССЫ И РАЗРЯДЫ",
            "uz": "SINFLAR VA XONALAR"
          }
        },
        {
          "label": {
            "ru": "обработка",
            "uz": "ishlov"
          },
          "value": {
            "ru": "ЧТЕНИЕ · СОСТАВ · СРАВНЕНИЕ · ОКРУГЛЕНИЕ",
            "uz": "O'QISH · TARKIB · TAQQOSLASH · YAXLITLASH"
          }
        }
      ]
    },
    "result": {
      "ru": "прочитать, разложить, сравнить и округлить",
      "uz": "o'qish, yoyish, taqqoslash va yaxlitlash"
    },
    "correctText": {
      "ru": "Полный пакет объединяет чтение, разрядный состав, сравнение и округление. Все действия опираются на место каждой цифры.",
      "uz": "To'liq paket o'qish, xona tarkibi, taqqoslash va yaxlitlashni birlashtiradi. Barcha harakatlar har bir raqamning o'rniga tayanadi."
    },
    "audio": {
      "intro": {
        "ru": [
          "Центр Lumo City получил новый пакет. Сегодня свяжем классы, разряды, чтение, разложение, сравнение и округление."
        ],
        "uz": [
          "Lumo City markazi yangi paket oldi. Bugun sinf, xona, o'qish, yoyish, taqqoslash va yaxlitlashni bog'laymiz."
        ]
      },
      "on_correct": {
        "ru": "Полный пакет начинается с места цифры. Оно помогает прочитать, разложить, сравнить и округлить число.",
        "uz": "To'liq paket raqam o'rnidan boshlanadi. U sonni o'qish, yoyish, taqqoslash va yaxlitlashga yordam beradi."
      }
    }
  },
  "s1": {
    "eyebrow": {
      "ru": "Классы и масштаб",
      "uz": "Sinflar va ko'lam"
    },
    "title": {
      "ru": "Две тройки разрядов и рост в десять раз",
      "uz": "Ikki xona uchligi va o'n marta o'sish"
    },
    "lead": {
      "ru": "Каждый класс повторяет сотни, десятки и единицы. Но один шаг цифры влево сразу меняет масштаб её значения.",
      "uz": "Har bir sinf yuzlik, o'nlik va birlikni takrorlaydi. Ammo raqamning chapga bir qadami uning qiymat ko'lamini darhol o'zgartiradi."
    },
    "instruction": {
      "ru": "Как связаны классы, разряды и значения одной цифры?",
      "uz": "Sinflar, xonalar va bitta raqam qiymatlari qanday bog'langan?"
    },
    "model": {
      "kind": "shift",
      "badge": {
        "ru": "Карта шести разрядов",
        "uz": "Oltita xona xaritasi"
      },
      "number": "7 → 70 → 700 → 7 000 → 70 000 → 700 000",
      "groups": [
        {
          "value": "704",
          "label": {
            "ru": "класс тысяч",
            "uz": "minglar sinfi"
          },
          "tone": "cyan"
        },
        {
          "value": "018",
          "label": {
            "ru": "класс единиц",
            "uz": "birlar sinfi"
          },
          "tone": "accent"
        }
      ],
      "steps": [
        {
          "ru": "единицы",
          "uz": "birlar"
        },
        {
          "ru": "десятки",
          "uz": "o'nlar"
        },
        {
          "ru": "сотни",
          "uz": "yuzlar"
        },
        {
          "ru": "тысячи",
          "uz": "minglar"
        },
        {
          "ru": "десятки тысяч",
          "uz": "o'n minglar"
        },
        {
          "ru": "сотни тысяч",
          "uz": "yuz minglar"
        }
      ]
    },
    "result": {
      "ru": "три разряда в классе, каждый шаг влево увеличивает значение в 10 раз",
      "uz": "sinfda uchta xona, chapga har qadam qiymatni 10 marta oshiradi"
    },
    "correctText": {
      "ru": "В каждом классе повторяется тройка сотни, десятки, единицы. Соседний разряд слева в десять раз старше, поэтому место цифры задаёт её масштаб.",
      "uz": "Har bir sinfda yuzlik, o'nlik, birlik uchligi takrorlanadi. Chapdagi qo'shni xona o'n marta katta, shuning uchun raqam o'rni uning ko'lamini belgilaydi."
    },
    "audio": {
      "intro": {
        "ru": [
          "Каждый класс повторяет сотни, десятки и единицы.",
          "При каждом сдвиге цифры на один разряд влево её значение становится в десять раз больше."
        ],
        "uz": [
          "Har bir sinf yuzlik, o'nlik va birlikni takrorlaydi.",
          "Raqam chapga bir xona siljiganda uning qiymati o'n marta ortadi."
        ]
      },
      "on_correct": {
        "ru": "Классы группируют разряды по три, а движение между соседними разрядами меняет значение в десять раз.",
        "uz": "Sinflar xonalarni uchtadan guruhlaydi, qo'shni xonalar orasidagi siljish esa qiymatni o'n marta o'zgartiradi."
      }
    }
  },
  "s2": {
    "eyebrow": {
      "ru": "Граница класса",
      "uz": "Sinf chegarasi"
    },
    "title": {
      "ru": "После 999 999 открывается новый класс",
      "uz": "999 999 dan keyin yangi sinf ochiladi"
    },
    "lead": {
      "ru": "Шесть девяток заполняют классы единиц и тысяч. Ещё одна единица запускает переход через все разряды и создаёт класс миллионов.",
      "uz": "Oltita to'qqiz birliklar va minglar sinfini to'ldiradi. Yana bir birlik barcha xonalardan o'tib, millionlar sinfini yaratadi."
    },
    "instruction": {
      "ru": "Почему после двух заполненных троек появляется третья?",
      "uz": "Nega to'lgan ikkita uchlikdan keyin uchinchi uchlik paydo bo'ladi?"
    },
    "model": {
      "kind": "boundary",
      "badge": {
        "ru": "ПЕРЕХОД ЧЕРЕЗ ГРАНИЦУ",
        "uz": "CHEGARADAN O'TISH"
      },
      "number": "999 999 → 1 000 000",
      "groups": [
        {
          "value": "999 | 999",
          "label": {
            "ru": "два класса заполнены",
            "uz": "ikki sinf to'lgan"
          },
          "tone": "cyan"
        },
        {
          "value": "1 | 000 | 000",
          "label": {
            "ru": "открылся класс миллионов",
            "uz": "millionlar sinfi ochildi"
          },
          "tone": "accent"
        }
      ],
      "steps": [
        {
          "ru": "Оба знакомых класса заполнены девятками",
          "uz": "Tanish ikkala sinf to'qqizlar bilan to'lgan"
        },
        {
          "ru": "Одна единица проходит через шесть разрядов",
          "uz": "Bir birlik oltita xonadan o'tadi"
        },
        {
          "ru": "Слева открывается новая тройка разрядов",
          "uz": "Chap tomonda yangi uchta xona ochiladi"
        }
      ]
    },
    "result": {
      "ru": "999 999 + 1 = 1 000 000",
      "uz": "999 999 + 1 = 1 000 000"
    },
    "correctText": {
      "ru": "Классы строятся тройками справа налево. Когда все разряды двух классов заполнены, следующая единица превращает их в нули и открывает слева класс миллионов.",
      "uz": "Sinflar o'ngdan chapga uchtadan tuziladi. Ikki sinfning barcha xonalari to'lganda keyingi birlik ularni nolga aylantirib, chapda millionlar sinfini ochadi."
    },
    "audio": {
      "intro": {
        "ru": [
          "Число девятьсот девяносто девять тысяч девятьсот девяносто девять заполняет оба знакомых класса до конца.",
          "Прибавляем одну единицу. Все шесть девяток превращаются в нули, а слева открывается класс миллионов."
        ],
        "uz": [
          "To'qqiz yuz to'qson to'qqiz ming to'qqiz yuz to'qson to'qqiz sonida tanish ikkala sinf ham to'liq band.",
          "Bir birlik qo'shiladi. Oltita to'qqiz nolga aylanadi va chap tomonda millionlar sinfi ochiladi."
        ]
      },
      "on_correct": {
        "ru": "Граница класса работает так. Новая тройка разрядов появляется, когда предыдущие классы полностью заполнены.",
        "uz": "Sinf chegarasi shunday ishlaydi. Oldingi sinflar to'lganda chap tomonda yangi uchta xona ochiladi."
      }
    }
  },
  "s3": {
    "eyebrow": {
      "ru": "От записи к составу",
      "uz": "Yozuvdan tarkibga"
    },
    "title": {
      "ru": "Читаем 704 018 и сразу раскрываем его состав",
      "uz": "704 018 ni o'qib, tarkibini darhol ochamiz"
    },
    "lead": {
      "ru": "Деление на классы подсказывает чтение, а разрядная таблица превращает каждую ненулевую цифру в слагаемое.",
      "uz": "Sinflarga ajratish o'qishni ko'rsatadi, xona jadvali esa har bir noldan farqli raqamni qo'shiluvchiga aylantiradi."
    },
    "instruction": {
      "ru": "Как из одной записи получить чтение и развёрнутую форму?",
      "uz": "Bitta yozuvdan o'qish va yoyiq ko'rinishni qanday olamiz?"
    },
    "model": {
      "kind": "table",
      "badge": {
        "ru": "Чтение и разложение",
        "uz": "O'qish va yoyish"
      },
      "number": "704 | 018",
      "columns": [
        {
          "label": {
            "ru": "сотни тысяч",
            "uz": "yuz minglar"
          },
          "value": "7"
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
          "value": "0"
        },
        {
          "label": {
            "ru": "десятки",
            "uz": "o'nlar"
          },
          "value": "1"
        },
        {
          "label": {
            "ru": "единицы",
            "uz": "birlar"
          },
          "value": "8"
        }
      ],
      "rows": [
        {
          "label": {
            "ru": "чтение",
            "uz": "o'qish"
          },
          "value": {
            "ru": "семьсот четыре тысячи восемнадцать",
            "uz": "yetti yuz to'rt ming o'n sakkiz"
          }
        },
        {
          "label": {
            "ru": "развёрнутая запись",
            "uz": "yoyiq yozuv"
          },
          "value": "700 000 + 4 000 + 10 + 8"
        }
      ]
    },
    "result": {
      "ru": "семьсот четыре тысячи восемнадцать; 700 000 + 4 000 + 10 + 8",
      "uz": "yetti yuz to'rt ming o'n sakkiz; 700 000 + 4 000 + 10 + 8"
    },
    "correctText": {
      "ru": "Левая тройка читается как семьсот четыре тысячи, правая как восемнадцать. Ненулевые цифры дают четыре разрядных слагаемых.",
      "uz": "Chap uchlik yetti yuz to'rt ming, o'ng uchlik o'n sakkiz deb o'qiladi. Noldan farqli raqamlar to'rtta xona qo'shiluvchisini beradi."
    },
    "audio": {
      "intro": {
        "ru": [
          "Сначала читаем семьсот четыре тысячи, затем восемнадцать.",
          "Семь даёт семьсот тысяч, четыре даёт четыре тысячи, единица даёт десять, восемь даёт восемь."
        ],
        "uz": [
          "Avval yetti yuz to'rt mingni, keyin o'n sakkizni o'qiymiz.",
          "Yetti yetti yuz mingni, to'rt to'rt mingni, bir o'nni, sakkiz esa sakkizni beradi."
        ]
      },
      "on_correct": {
        "ru": "Нули удерживают пустые места в обычной записи, но нулевые слагаемые в развёрнутой форме можно не писать.",
        "uz": "Nollar odatiy yozuvdagi bo'sh o'rinlarni saqlaydi, yoyiq yozuvda esa nol qo'shiluvchilarni yozmaslik mumkin."
      }
    }
  },
  "s4": {
    "eyebrow": {
      "ru": "Карта инварианта",
      "uz": "Invariant xaritasi"
    },
    "title": {
      "ru": "Четыре записи показывают одно число",
      "uz": "To'rtta ko'rinish bitta sonni ko'rsatadi"
    },
    "lead": {
      "ru": "Обычная запись, чтение, таблица разрядов и развёрнутая сумма выглядят по-разному, но сохраняют те же цифры на тех же местах.",
      "uz": "Oddiy yozuv, o'qilishi, xona jadvali va yoyiq yig'indi turlicha ko'rinadi, ammo bir xil raqamlarni o'z joyida saqlaydi."
    },
    "instruction": {
      "ru": "Что остаётся неизменным во всех четырёх формах?",
      "uz": "To'rtta ko'rinishning barchasida nima o'zgarmaydi?"
    },
    "model": {
      "kind": "invariant",
      "badge": {
        "ru": "ЧЕТЫРЕ РАВНЫЕ ФОРМЫ",
        "uz": "TO'RTTA TENG KO'RINISH"
      },
      "number": "482 307",
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
          "value": "8"
        },
        {
          "label": {
            "ru": "тысячи",
            "uz": "minglar"
          },
          "value": "2"
        },
        {
          "label": {
            "ru": "сотни",
            "uz": "yuzlar"
          },
          "value": "3"
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
          "value": "7"
        }
      ],
      "rows": [
        {
          "label": {
            "ru": "чтение",
            "uz": "o'qilishi"
          },
          "value": {
            "ru": "четыреста восемьдесят две тысячи триста семь",
            "uz": "to'rt yuz sakson ikki ming uch yuz yetti"
          }
        },
        {
          "label": {
            "ru": "развёрнутая сумма",
            "uz": "yoyiq yig'indi"
          },
          "value": "400 000 + 80 000 + 2 000 + 300 + 7"
        }
      ]
    },
    "result": {
      "ru": "значения разрядов сохраняются",
      "uz": "xona qiymatlari saqlanadi"
    },
    "correctText": {
      "ru": "Во всех четырёх формах цифра 8 означает 80 000, цифра 0 удерживает разряд десятков, а сумма разрядных значений снова даёт 482 307.",
      "uz": "To'rtta ko'rinishda ham 8 raqami 80 000 ni bildiradi, 0 raqami o'nlar xonasini saqlaydi, xona qiymatlari yig'indisi esa yana 482 307 ni beradi."
    },
    "audio": {
      "intro": {
        "ru": [
          "Одно и то же число можно записать цифрами, прочитать словами, разместить в таблице и разложить на разрядные значения.",
          "В каждой форме восемь означает восемьдесят тысяч, а ноль сохраняет пустой разряд десятков."
        ],
        "uz": [
          "Bitta sonni raqamlar bilan yozish, so'zlar bilan o'qish, jadvalga joylash va xona qiymatlariga yoyish mumkin.",
          "Har bir ko'rinishda sakkiz sakson mingni bildiradi, nol esa bo'sh o'nlar xonasini saqlaydi."
        ]
      },
      "on_correct": {
        "ru": "Если собрать все разрядные значения, снова получится четыреста восемьдесят две тысячи триста семь. Форма меняется, но число остаётся тем же.",
        "uz": "Barcha xona qiymatlari yig'ilsa, yana to'rt yuz sakson ikki ming uch yuz yetti hosil bo'ladi. Ko'rinish o'zgaradi, son esa o'sha son bo'lib qoladi."
      }
    }
  },
  "s5": {
    "eyebrow": {
      "ru": "Сравнение и оценка",
      "uz": "Taqqoslash va baholash"
    },
    "title": {
      "ru": "Сначала первое отличие, затем ближайшая тысяча",
      "uz": "Avval birinchi farq, keyin eng yaqin minglik"
    },
    "lead": {
      "ru": "Одна разрядная карта помогает решить две задачи: сравнить число и определить направление округления.",
      "uz": "Bitta xona xaritasi ikki vazifani bajaradi: sonni taqqoslaydi va yaxlitlash yo'nalishini aniqlaydi."
    },
    "instruction": {
      "ru": "Почему 704 018 больше 699 950 и округляется к 704 000?",
      "uz": "Nega 704 018 soni 699 950 dan katta va 704 000 ga yaxlitlanadi?"
    },
    "model": {
      "kind": "numberline",
      "badge": {
        "ru": "Два решения на одной карте",
        "uz": "Bitta xaritada ikki yechim"
      },
      "number": "704 000 ─ 704 018 ───────────── 705 000",
      "rows": [
        {
          "label": {
            "ru": "сравнение слева",
            "uz": "chapdan taqqoslash"
          },
          "value": "7 0 4 0 1 8  >  6 9 9 9 5 0"
        },
        {
          "label": {
            "ru": "первое отличие",
            "uz": "birinchi farq"
          },
          "value": "7 > 6"
        },
        {
          "label": {
            "ru": "остаток до тысяч",
            "uz": "minglikdan keyingi qoldiq"
          },
          "value": "018 < 500"
        },
        {
          "label": {
            "ru": "результат округления",
            "uz": "yaxlitlash natijasi"
          },
          "value": "704 000"
        }
      ]
    },
    "result": "704 018 > 699 950; 704 018 ≈ 704 000",
    "correctText": {
      "ru": "Числа шестизначные, и первое отличие находится в сотнях тысяч. Для округления остаток восемнадцать меньше пятисот, поэтому выбирается нижняя тысяча.",
      "uz": "Sonlar olti xonali, birinchi farq yuz minglarda. Yaxlitlashda o'n sakkiz qoldiq besh yuzdan kichik, shuning uchun quyi minglik tanlanadi."
    },
    "audio": {
      "intro": {
        "ru": [
          "Оба числа шестизначные. Первое отличие слева показывает семь сотен тысяч против шести.",
          "Для округления остаток равен восемнадцати. Он меньше пятисот, поэтому выбираем нижнюю тысячу."
        ],
        "uz": [
          "Ikkala son ham olti xonali. Chapdagi birinchi farq yetti yuz mingni olti yuz ming bilan solishtiradi.",
          "Yaxlitlashda qoldiq o'n sakkiz. U besh yuzdan kichik, shuning uchun quyi minglikni tanlaymiz."
        ]
      },
      "on_correct": {
        "ru": "Сравнение использует старшие разряды, округление использует ближайшие границы. Обе стратегии сохраняют структуру числа.",
        "uz": "Taqqoslash katta xonalardan, yaxlitlash yaqin chegaralardan foydalanadi. Ikkala strategiya ham son tuzilishini saqlaydi."
      }
    }
  },
  "s6": {
    "eyebrow": {
      "ru": "Общий алгоритм",
      "uz": "Umumiy algoritm"
    },
    "title": {
      "ru": "Один порядок для полного пакета",
      "uz": "To'liq paket uchun bitta tartib"
    },
    "lead": {
      "ru": "Каждое следующее действие использует результат предыдущего. Разрядная структура остаётся общей опорой.",
      "uz": "Har bir keyingi harakat oldingi natijadan foydalanadi. Xona tuzilishi umumiy tayanch bo'lib qoladi."
    },
    "instruction": {
      "ru": "В каком порядке обрабатывать многозначное число?",
      "uz": "Ko'p xonali songa qaysi tartibda ishlov beramiz?"
    },
    "model": {
      "kind": "flow",
      "badge": {
        "ru": "Маршрут решения",
        "uz": "Yechim yo'nalishi"
      },
      "steps": [
        {
          "ru": "1. Разделить на классы и прочитать",
          "uz": "1. Sinflarga ajratish va o'qish"
        },
        {
          "ru": "2. Назвать разряды и разложить",
          "uz": "2. Xonalarni aytish va yoyish"
        },
        {
          "ru": "3. Сравнить слева направо",
          "uz": "3. Chapdan o'ngga taqqoslash"
        },
        {
          "ru": "4. Выбрать разряд округления",
          "uz": "4. Yaxlitlash xonasini tanlash"
        }
      ]
    },
    "result": {
      "ru": "прочитать → разложить → сравнить → округлить",
      "uz": "o'qish → yoyish → taqqoslash → yaxlitlash"
    },
    "correctText": {
      "ru": "Сначала раскрываем структуру числа. Затем используем её для разложения, сравнения и выбора ближайшего круглого числа.",
      "uz": "Avval sonning tuzilishini ochamiz. Keyin undan yoyish, taqqoslash va eng yaqin yumaloq sonni tanlashda foydalanamiz."
    },
    "audio": {
      "intro": {
        "ru": [
          "Сначала читаем число по классам. Затем раскладываем, сравниваем слева направо и выбираем нужную точность округления."
        ],
        "uz": [
          "Avval sonni sinflar bo'yicha o'qiymiz. Keyin yoyamiz, chapdan taqqoslaymiz va yaxlitlash aniqligini tanlaymiz."
        ]
      },
      "on_correct": {
        "ru": "Все четыре действия опираются на разряды. Поэтому таблица остаётся общей картой решения.",
        "uz": "To'rtta harakatning barchasi xonalarga tayanadi. Shuning uchun jadval umumiy yechim xaritasi bo'lib qoladi."
      }
    }
  },
  "s7": {
    "eyebrow": {
      "ru": "Разбор пакета",
      "uz": "Paket tahlili"
    },
    "title": {
      "ru": "Полный пример для числа 620 405",
      "uz": "620 405 soni uchun to'liq misol"
    },
    "lead": {
      "ru": "Проследи, как одно число проходит чтение, разложение, сравнение и округление.",
      "uz": "Bitta son o'qish, yoyish, taqqoslash va yaxlitlashdan qanday o'tishini kuzating."
    },
    "instruction": {
      "ru": "Как связаны четыре результата?",
      "uz": "To'rtta natija qanday bog'langan?"
    },
    "model": {
      "kind": "rows",
      "badge": {
        "ru": "Готовый пакет",
        "uz": "Tayyor paket"
      },
      "number": "620 405",
      "rows": [
        {
          "label": {
            "ru": "чтение",
            "uz": "o'qish"
          },
          "value": {
            "ru": "шестьсот двадцать тысяч четыреста пять",
            "uz": "olti yuz yigirma ming to'rt yuz besh"
          }
        },
        {
          "label": {
            "ru": "разложение",
            "uz": "yoyish"
          },
          "value": "600 000 + 20 000 + 400 + 5"
        },
        {
          "label": {
            "ru": "сравнение",
            "uz": "taqqoslash"
          },
          "value": "620 405 > 620 045"
        },
        {
          "label": {
            "ru": "до тысяч",
            "uz": "minglikkacha"
          },
          "value": "620 000"
        }
      ]
    },
    "result": {
      "ru": "все результаты сохраняют разрядную структуру",
      "uz": "barcha natijalar xona tuzilishini saqlaydi"
    },
    "correctText": {
      "ru": "Число читается по классам, раскладывается по ненулевым цифрам, сравнивается по сотням и округляется вниз, потому что остаток равен 405.",
      "uz": "Son sinflar bo'yicha o'qiladi, noldan farqli raqamlar bo'yicha yoyiladi, yuzlarda taqqoslanadi va 405 qoldiq sabab pastga yaxlitlanadi."
    },
    "audio": {
      "intro": {
        "ru": [
          "Читаем шестьсот двадцать тысяч четыреста пять. Разложение сохраняет четыре ненулевых разрядных значения."
        ],
        "uz": [
          "Olti yuz yigirma ming to'rt yuz besh deb o'qiymiz. Yoyiq yozuv to'rtta noldan farqli xona qiymatini saqlaydi."
        ]
      },
      "on_correct": {
        "ru": "Первое число больше по сотням. Остаток четыреста пять меньше пятисот, поэтому округляем к шестистам двадцати тысячам.",
        "uz": "Birinchi son yuzlar bo'yicha katta. Qoldiq to'rt yuz besh besh yuzdan kichik, shuning uchun pastga yaxlitlaymiz."
      }
    }
  },
  "s8": {
    "eyebrow": {
      "ru": "Мини-проверка",
      "uz": "Kichik tekshiruv"
    },
    "title": {
      "ru": "Найди значение цифры 7",
      "uz": "7 raqamining qiymatini toping"
    },
    "lead": {
      "ru": "Используй разрядную таблицу. Запиши значение цифры без пробелов.",
      "uz": "Xona jadvalidan foydalaning. Raqamning qiymatini bo'sh joysiz yozing."
    },
    "instruction": {
      "ru": "Чему равно значение цифры 7 в числе 704 018?",
      "uz": "704 018 sonidagi 7 raqamining qiymati qancha?"
    },
    "model": {
      "kind": "table",
      "badge": {
        "ru": "Сотни тысяч",
        "uz": "Yuz minglar"
      },
      "number": "704 018",
      "columns": [
        {
          "label": {
            "ru": "сотни тысяч",
            "uz": "yuz minglar"
          },
          "value": "7"
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
          "value": "0"
        },
        {
          "label": {
            "ru": "десятки",
            "uz": "o'nlar"
          },
          "value": "1"
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
    "placeholder": {
      "ru": "0",
      "uz": "0"
    },
    "correctValue": "700000",
    "correctText": {
      "ru": "Цифра 7 стоит в сотнях тысяч, поэтому её значение равно 700 000.",
      "uz": "7 raqami yuz minglar xonasida, shuning uchun uning qiymati 700 000."
    },
    "wrongText": {
      "ru": "Найди столбец цифры 7. Она стоит в сотнях тысяч, поэтому к семёрке нужны пять нулей.",
      "uz": "7 raqamining ustunini toping. U yuz minglarda turibdi, shuning uchun yettiga beshta nol kerak."
    },
    "wrongByValue": {
      "7": {
        "ru": "Это цифра без её разрядного значения. Учти сотни тысяч.",
        "uz": "Bu xona qiymatisiz raqam. Yuz minglarni hisobga oling."
      },
      "7000": {
        "ru": "Это тысячи. Верни цифру 7 в сотни тысяч.",
        "uz": "Bu minglar. 7 raqamini yuz minglarga qaytaring."
      },
      "70000": {
        "ru": "Это десятки тысяч. Цифра 7 стоит на один разряд левее.",
        "uz": "Bu o'n minglar. 7 raqami bir xona chapda turibdi."
      }
    },
    "inputWrongAudio": {
      "ru": "Проверь столбец сотен тысяч. Значение цифры семь должно содержать пять нулей.",
      "uz": "Yuz minglar ustunini tekshiring. Yetti raqamining qiymatida beshta nol bo'lishi kerak."
    },
    "audio": {
      "intro": {
        "ru": [
          "Определи значение цифры семь в числе семьсот четыре тысячи восемнадцать. Ответ запиши цифрами."
        ],
        "uz": [
          "Yetti yuz to'rt ming o'n sakkiz sonidagi yetti raqamining qiymatini aniqlang. Javobni raqamlar bilan yozing."
        ]
      },
      "on_correct": {
        "ru": "Верно. Семёрка в сотнях тысяч означает семьсот тысяч.",
        "uz": "To'g'ri. Yuz minglardagi yetti raqami yetti yuz mingni bildiradi."
      },
      "on_wrong": {
        "ru": "Проверь столбец сотен тысяч. К семёрке нужны пять нулей.",
        "uz": "Yuz minglar ustunini tekshiring. Yettiga beshta nol kerak."
      }
    }
  },
  "s9": {
    "eyebrow": {
      "ru": "Стена решений",
      "uz": "Yechimlar devori"
    },
    "title": {
      "ru": "Четыре готовых шага для 508 070",
      "uz": "508 070 uchun to'rtta tayyor qadam"
    },
    "lead": {
      "ru": "Это не тест. Каждый пример уже решён и показывает отдельную часть полного пакета.",
      "uz": "Bu test emas. Har bir misol yechilgan va to'liq paketning alohida qismini ko'rsatadi."
    },
    "audio": {
      "intro": {
        "ru": [
          "Разберём четыре готовых решения для числа пятьсот восемь тысяч семьдесят."
        ],
        "uz": [
          "Besh yuz sakkiz ming yetmish soni uchun to'rtta tayyor yechimni tahlil qilamiz."
        ]
      }
    },
    "items": [
      {
        "question": {
          "ru": "Как прочитать число 508 070?",
          "uz": "508 070 soni qanday o'qiladi?"
        },
        "answer": {
          "ru": "пятьсот восемь тысяч семьдесят",
          "uz": "besh yuz sakkiz ming yetmish"
        },
        "correctText": {
          "ru": "Класс тысяч читается первым, затем читается семьдесят.",
          "uz": "Avval minglar sinfi, keyin yetmish o'qiladi."
        },
        "audio": {
          "intro": {
            "ru": [
              "Сначала читаем класс тысяч, затем класс единиц."
            ],
            "uz": [
              "Avval minglar sinfini, keyin birlar sinfini o'qiymiz."
            ]
          },
          "on_correct": {
            "ru": "Получаем пятьсот восемь тысяч семьдесят.",
            "uz": "Besh yuz sakkiz ming yetmish hosil bo'ladi."
          }
        }
      },
      {
        "question": {
          "ru": "Как выглядит развёрнутая запись?",
          "uz": "Yoyiq yozuv qanday ko'rinadi?"
        },
        "answer": "500 000 + 8 000 + 70",
        "correctText": {
          "ru": "Три ненулевые цифры дают три разрядных слагаемых.",
          "uz": "Uchta noldan farqli raqam uchta xona qo'shiluvchisini beradi."
        },
        "audio": {
          "intro": {
            "ru": [
              "Пятьсот тысяч, восемь тысяч и семьдесят образуют развёрнутую запись."
            ],
            "uz": [
              "Besh yuz ming, sakkiz ming va yetmish yoyiq yozuvni hosil qiladi."
            ]
          },
          "on_correct": {
            "ru": "Нулевые разрядные слагаемые можно не записывать.",
            "uz": "Nol xona qo'shiluvchilarini yozmaslik mumkin."
          }
        }
      },
      {
        "question": {
          "ru": "Как сравнить 508 070 и 508 007?",
          "uz": "508 070 va 508 007 qanday taqqoslanadi?"
        },
        "answer": "508 070 > 508 007",
        "correctText": {
          "ru": "Первое отличие находится в десятках: семь десятков больше нуля десятков.",
          "uz": "Birinchi farq o'nlarda: yetti o'nlik nol o'nlikdan katta."
        },
        "audio": {
          "intro": {
            "ru": [
              "Первые четыре разряда совпадают. В десятках первое число имеет семь, второе ноль."
            ],
            "uz": [
              "Dastlabki to'rtta xona teng. O'nlarda birinchi sonda yetti, ikkinchisida nol bor."
            ]
          },
          "on_correct": {
            "ru": "Поэтому первое число больше второго.",
            "uz": "Shuning uchun birinchi son ikkinchisidan katta."
          }
        }
      },
      {
        "question": {
          "ru": "Как округлить 508 070 до тысяч?",
          "uz": "508 070 sonini minglikkacha qanday yaxlitlaymiz?"
        },
        "answer": "508 000",
        "correctText": {
          "ru": "Остаток 070 меньше 500, поэтому выбирается нижняя тысяча.",
          "uz": "070 qoldiq 500 dan kichik, shuning uchun quyi minglik tanlanadi."
        },
        "audio": {
          "intro": {
            "ru": [
              "Остаток равен семидесяти. Он меньше пятисот, поэтому число округляется вниз."
            ],
            "uz": [
              "Qoldiq yetmishga teng. U besh yuzdan kichik, shuning uchun son pastga yaxlitlanadi."
            ]
          },
          "on_correct": {
            "ru": "Получаем пятьсот восемь тысяч.",
            "uz": "Besh yuz sakkiz ming hosil bo'ladi."
          }
        }
      }
    ],
    "completionText": {
      "ru": "Четыре части пакета разобраны.",
      "uz": "Paketning to'rtta qismi tahlil qilindi."
    }
  },
  "s10": {
    "eyebrow": {
      "ru": "Выбор модели",
      "uz": "Modelni tanlash"
    },
    "title": {
      "ru": "Каждой задаче свой инструмент",
      "uz": "Har bir vazifa uchun o'z vositasi"
    },
    "lead": {
      "ru": "Одна модель не обязана быть лучшей для всех действий. Выбор зависит от вопроса.",
      "uz": "Bitta model barcha harakatlar uchun eng yaxshi bo'lishi shart emas. Tanlov savolga bog'liq."
    },
    "instruction": {
      "ru": "Какая стратегия делает полный пакет надёжным?",
      "uz": "Qaysi strategiya to'liq paketni ishonchli qiladi?"
    },
    "model": {
      "kind": "flow",
      "badge": {
        "ru": "Три инструмента",
        "uz": "Uchta vosita"
      },
      "steps": [
        {
          "ru": "Таблица для чтения и разложения",
          "uz": "O'qish va yoyish uchun jadval"
        },
        {
          "ru": "Первое отличие для сравнения",
          "uz": "Taqqoslash uchun birinchi farq"
        },
        {
          "ru": "Числовая прямая для округления",
          "uz": "Yaxlitlash uchun son chizig'i"
        }
      ]
    },
    "options": [
      {
        "ru": "Выбирать модель по задаче и проверять разряды",
        "uz": "Modelni vazifaga ko'ra tanlash va xonalarni tekshirish"
      },
      {
        "ru": "Всегда использовать только разрядную таблицу",
        "uz": "Har doim faqat xona jadvalidan foydalanish"
      },
      {
        "ru": "Смотреть только на последнюю цифру",
        "uz": "Faqat oxirgi raqamga qarash"
      },
      {
        "ru": "Удалять нули перед выбором модели",
        "uz": "Model tanlashdan oldin nollarni olib tashlash"
      }
    ],
    "correctIndex": 0,
    "correctText": {
      "ru": "Таблица раскрывает места цифр, первое различие ускоряет сравнение, а числовая прямая показывает ближайшее круглое число.",
      "uz": "Jadval raqamlar o'rnini ochadi, birinchi farq taqqoslashni tezlashtiradi, son chizig'i esa eng yaqin yumaloq sonni ko'rsatadi."
    },
    "wrong": [
      null,
      {
        "ru": "Таблица полезна, но для округления числовая прямая яснее, а для сравнения достаточно первого различия.",
        "uz": "Jadval foydali, ammo yaxlitlashda son chizig'i aniqroq, taqqoslashda esa birinchi farq yetarli."
      },
      {
        "ru": "Последняя цифра не показывает старшие разряды и не решает все задачи.",
        "uz": "Oxirgi raqam katta xonalarni ko'rsatmaydi va barcha vazifani hal qilmaydi."
      },
      {
        "ru": "Нули сохраняют пустые разряды. Их удаление меняет структуру числа.",
        "uz": "Nollar bo'sh xonalarni saqlaydi. Ularni olib tashlash son tuzilishini o'zgartiradi."
      }
    ],
    "audio": {
      "intro": {
        "ru": [
          "Для чтения и разложения удобна таблица. Для сравнения ищем первое отличие. Для округления помогает числовая прямая."
        ],
        "uz": [
          "O'qish va yoyishda jadval qulay. Taqqoslashda birinchi farqni izlaymiz. Yaxlitlashda son chizig'i yordam beradi."
        ]
      },
      "on_correct": {
        "ru": "Надёжная стратегия выбирает модель по задаче и сохраняет разрядную структуру.",
        "uz": "Ishonchli strategiya modelni vazifaga ko'ra tanlaydi va xona tuzilishini saqlaydi."
      },
      "on_wrong": [
        null,
        {
          "ru": "Один инструмент не всегда показывает нужную связь лучше остальных.",
          "uz": "Bitta vosita kerakli bog'lanishni har doim boshqalardan yaxshiroq ko'rsatmaydi."
        },
        {
          "ru": "Последняя цифра не заменяет анализ старших разрядов.",
          "uz": "Oxirgi raqam katta xonalar tahlilini almashtirmaydi."
        },
        {
          "ru": "Нули нельзя удалять, они удерживают пустые места.",
          "uz": "Nollarni olib tashlab bo'lmaydi, ular bo'sh o'rinlarni saqlaydi."
        }
      ]
    }
  },
  "s11": {
    "eyebrow": {
      "ru": "Лаборатория ошибок",
      "uz": "Xatolar laboratoriyasi"
    },
    "title": {
      "ru": "Три сдвига, три способа повредить число",
      "uz": "Uch siljish, sonni buzishning uch usuli"
    },
    "lead": {
      "ru": "Внутренний ноль, неверное слагаемое и ошибочное округление выглядят по-разному, но все три ошибки начинаются с потери разряда.",
      "uz": "Ichki nol, noto'g'ri qo'shiluvchi va xato yaxlitlash turlicha ko'rinadi, ammo uchala xato ham xonani yo'qotishdan boshlanadi."
    },
    "instruction": {
      "ru": "Как восстановить разрядную структуру в каждом случае?",
      "uz": "Har bir holatda xona tuzilishini qanday tiklaymiz?"
    },
    "model": {
      "kind": "table",
      "badge": {
        "ru": "Три неисправности",
        "uz": "Uchta nosozlik"
      },
      "rows": [
        {
          "label": {
            "ru": "потеряны внутренние нули",
            "uz": "ichki nollar yo'qolgan"
          },
          "value": "704 018 → 740 180"
        },
        {
          "label": {
            "ru": "четвёрка сдвинута влево",
            "uz": "to'rt chapga siljigan"
          },
          "value": "4 000 → 40 000"
        },
        {
          "label": {
            "ru": "остаток прочитан неверно",
            "uz": "qoldiq noto'g'ri o'qilgan"
          },
          "value": "018 → 705 000"
        }
      ]
    },
    "repairs": [
      {
        "label": {
          "ru": "Вернуть нули",
          "uz": "Nollarni qaytarish"
        },
        "before": "740 180",
        "after": "704 018",
        "text": {
          "ru": "Нули снова удерживают десятки тысяч и сотни.",
          "uz": "Nollar yana o'n minglar va yuzlar xonalarini saqlaydi."
        }
      },
      {
        "label": {
          "ru": "Вернуть разряд",
          "uz": "Xonani qaytarish"
        },
        "before": "40 000",
        "after": "4 000",
        "text": {
          "ru": "Сдвиг вправо уменьшает значение в десять раз.",
          "uz": "O'ngga bir xona siljish qiymatni o'n marta kamaytiradi."
        }
      },
      {
        "label": {
          "ru": "Проверить границу",
          "uz": "Chegarani tekshirish"
        },
        "before": "705 000",
        "after": "704 000",
        "text": {
          "ru": "Остаток восемнадцать меньше пятисот, поэтому выбирается нижняя тысяча.",
          "uz": "O'n sakkiz qoldiq besh yuzdan kichik, shuning uchun quyi minglik tanlanadi."
        }
      }
    ],
    "result": {
      "ru": "704 018; 4 000; 704 000",
      "uz": "704 018; 4 000; 704 000"
    },
    "correctText": {
      "ru": "Сначала восстанавливаем пустые места, затем проверяем разряд каждого значения и только после этого выбираем границу округления.",
      "uz": "Avval bo'sh o'rinlarni tiklaymiz, keyin har bir qiymat xonasini tekshiramiz, shundan so'ng yaxlitlash chegarasini tanlaymiz."
    },
    "audio": {
      "intro": {
        "ru": [
          "Первая ошибка удаляет внутренние нули. Вторая сдвигает четвёрку на один разряд влево.",
          "Третья ошибка выбирает верхнюю тысячу, хотя остаток меньше пятисот."
        ],
        "uz": [
          "Birinchi xato ichki nollarni olib tashlaydi. Ikkinchisi to'rtni bir xona chapga siljitadi.",
          "Uchinchi xato qoldiq besh yuzdan kichik bo'lsa ham yuqori minglikni tanlaydi."
        ]
      },
      "on_correct": {
        "ru": "Все три исправления возвращают цифры и границы на правильные места.",
        "uz": "Uchala tuzatish ham raqamlar va chegaralarni to'g'ri o'rinlarga qaytaradi."
      }
    }
  },
  "s12": {
    "eyebrow": {
      "ru": "Лаборатория решений",
      "uz": "Yechimlar laboratoriyasi"
    },
    "title": {
      "ru": "Два городских пакета проходят одну проверку",
      "uz": "Ikki shahar paketi bitta tekshiruvdan o'tadi"
    },
    "lead": {
      "ru": "Северный и южный секторы прислали разные числа. Для каждого пакета сохраняем одну цепочку: прочитать, разложить, сравнить и округлить.",
      "uz": "Shimoliy va janubiy sektorlar turli sonlarni yubordi. Har bir paket uchun bitta zanjir saqlanadi: o'qish, yoyish, taqqoslash va yaxlitlash."
    },
    "instruction": {
      "ru": "Как одна разрядная система согласует все четыре действия?",
      "uz": "Bitta xona tizimi to'rtta harakatni qanday moslashtiradi?"
    },
    "packets": [
      {
        "label": {
          "ru": "СЕВЕРНЫЙ СЕКТОР",
          "uz": "SHIMOLIY SEKTOR"
        },
        "number": "408 750",
        "reading": {
          "ru": "четыреста восемь тысяч семьсот пятьдесят",
          "uz": "to'rt yuz sakkiz ming yetti yuz ellik"
        },
        "expanded": "400 000 + 8 000 + 700 + 50",
        "comparison": "408 750 > 407 980",
        "rounded": "408 750 → 409 000",
        "note": {
          "ru": "Первое отличие находится в тысячах: 8 больше 7. Остаток 750 ведёт к верхней тысяче.",
          "uz": "Birinchi farq minglarda: 8 soni 7 dan katta. 750 qoldiq yuqori minglikka olib boradi."
        }
      },
      {
        "label": {
          "ru": "ЮЖНЫЙ СЕКТОР",
          "uz": "JANUBIY SEKTOR"
        },
        "number": "407 980",
        "reading": {
          "ru": "четыреста семь тысяч девятьсот восемьдесят",
          "uz": "to'rt yuz yetti ming to'qqiz yuz sakson"
        },
        "expanded": "400 000 + 7 000 + 900 + 80",
        "comparison": "407 980 < 408 750",
        "rounded": "407 980 → 408 000",
        "note": {
          "ru": "В тысячах стоит 7, поэтому пакет меньше. Остаток 980 переводит число к следующей тысяче.",
          "uz": "Minglarda 7 turibdi, shuning uchun paket kichik. 980 qoldiq sonni keyingi minglikka o'tkazadi."
        }
      }
    ],
    "result": {
      "ru": "408 750 > 407 980, но оба числа округляются вверх",
      "uz": "408 750 > 407 980, ammo ikkala son ham yuqoriga yaxlitlanadi"
    },
    "correctText": {
      "ru": "Чтение и разложение сохраняют позиции цифр. Сравнение ищет первое отличие слева, а округление отдельно оценивает остаток до ближайшей тысячи.",
      "uz": "O'qish va yoyish raqamlar o'rnini saqlaydi. Taqqoslash chapdan birinchi farqni topadi, yaxlitlash esa eng yaqin minglikkacha qoldiqni alohida baholaydi."
    },
    "audio": {
      "intro": {
        "ru": [
          "Северный сектор прислал четыреста восемь тысяч семьсот пятьдесят. После разложения видны тысячи, сотни и десятки, а округление ведёт к четырёмстам девяти тысячам.",
          "Южный сектор прислал четыреста семь тысяч девятьсот восемьдесят. Он меньше уже в разряде тысяч и округляется к четырёмстам восьми тысячам."
        ],
        "uz": [
          "Shimoliy sektor to'rt yuz sakkiz ming yetti yuz ellikni yubordi. Yoyilganda minglar, yuzlar va o'nlar ko'rinadi, yaxlitlash esa to'rt yuz to'qqiz mingga olib boradi.",
          "Janubiy sektor to'rt yuz yetti ming to'qqiz yuz saksonni yubordi. U minglar xonasidayoq kichik va to'rt yuz sakkiz mingga yaxlitlanadi."
        ]
      },
      "on_correct": {
        "ru": "Оба пакета проверены одной цепочкой. Сначала читаем и раскладываем, затем сравниваем слева и после этого выбираем точность округления.",
        "uz": "Ikkala paket bitta zanjir bilan tekshirildi. Avval o'qiymiz va yoyamiz, keyin chapdan taqqoslaymiz, shundan so'ng yaxlitlash aniqligini tanlaymiz."
      }
    }
  },
  "s13": {
    "eyebrow": {
      "ru": "Финальный пакет",
      "uz": "Yakuniy paket"
    },
    "title": {
      "ru": "Выбери полностью верный пакет для 306 450",
      "uz": "306 450 uchun to'liq to'g'ri paketni tanlang"
    },
    "lead": {
      "ru": "Только один пакет точно сохраняет чтение, разложение, сравнение и округление.",
      "uz": "Faqat bitta paket o'qish, yoyish, taqqoslash va yaxlitlashni aniq saqlaydi."
    },
    "instruction": {
      "ru": "Какой пакет не содержит ошибок?",
      "uz": "Qaysi paketda xato yo'q?"
    },
    "model": {
      "kind": "city",
      "badge": {
        "ru": "Данные сенсора",
        "uz": "Sensor ma'lumotlari"
      },
      "number": "306 450",
      "rows": [
        {
          "label": {
            "ru": "сравнить с",
            "uz": "bilan taqqoslash"
          },
          "value": "306 405"
        },
        {
          "label": {
            "ru": "округлить до",
            "uz": "yaxlitlash aniqligi"
          },
          "value": "1 000"
        }
      ]
    },
    "options": [
      {
        "ru": "триста шесть тысяч четыреста пятьдесят; 300 000 + 6 000 + 400 + 50; больше 306 405; до тысяч 306 000",
        "uz": "uch yuz olti ming to'rt yuz ellik; 300 000 + 6 000 + 400 + 50; 306 405 dan katta; minglikkacha 306 000"
      },
      {
        "ru": "триста шесть тысяч четыреста пятьдесят; 300 000 + 60 000 + 400 + 50; больше 306 405; до тысяч 306 000",
        "uz": "uch yuz olti ming to'rt yuz ellik; 300 000 + 60 000 + 400 + 50; 306 405 dan katta; minglikkacha 306 000"
      },
      {
        "ru": "триста шесть тысяч четыреста пятьдесят; 300 000 + 6 000 + 400 + 50; меньше 306 405; до тысяч 306 000",
        "uz": "uch yuz olti ming to'rt yuz ellik; 300 000 + 6 000 + 400 + 50; 306 405 dan kichik; minglikkacha 306 000"
      },
      {
        "ru": "триста шесть тысяч четыреста пятьдесят; 300 000 + 6 000 + 400 + 50; больше 306 405; до тысяч 307 000",
        "uz": "uch yuz olti ming to'rt yuz ellik; 300 000 + 6 000 + 400 + 50; 306 405 dan katta; minglikkacha 307 000"
      }
    ],
    "correctIndex": 0,
    "correctText": {
      "ru": "Пакет точный. Число разложено по разрядам, оно больше 306 405 по десяткам и округляется к 306 000.",
      "uz": "Paket aniq. Son xonalar bo'yicha yoyilgan, o'nlarda 306 405 dan katta va 306 000 ga yaxlitlanadi."
    },
    "wrong": [
      null,
      {
        "ru": "Цифра 6 стоит в тысячах, а не в десятках тысяч. Нужно слагаемое 6 000.",
        "uz": "6 raqami o'n minglarda emas, minglarda turibdi. 6 000 qo'shiluvchisi kerak."
      },
      {
        "ru": "Первые три цифры совпадают, но в десятках 5 больше 0. Поэтому 306 450 больше.",
        "uz": "Dastlabki uchta raqam teng, ammo o'nlarda 5 soni 0 dan katta. Shuning uchun 306 450 katta."
      },
      {
        "ru": "Остаток 450 меньше 500, поэтому число округляется вниз к 306 000.",
        "uz": "450 qoldiq 500 dan kichik, shuning uchun son 306 000 ga pastga yaxlitlanadi."
      }
    ],
    "audio": {
      "intro": {
        "ru": [
          "Проверь четыре части пакета для числа триста шесть тысяч четыреста пятьдесят. Выбери полностью точный вариант."
        ],
        "uz": [
          "Uch yuz olti ming to'rt yuz ellik soni paketining to'rtta qismini tekshiring. To'liq aniq variantni tanlang."
        ]
      },
      "on_correct": {
        "ru": "Пакет принят. Все четыре части согласованы с разрядной структурой числа.",
        "uz": "Paket qabul qilindi. To'rtta qismning barchasi sonning xona tuzilishiga mos."
      },
      "on_wrong": [
        null,
        {
          "ru": "Шесть означает тысячи, а не десятки тысяч. Исправь развёрнутую запись.",
          "uz": "Olti minglarni bildiradi, o'n minglarni emas. Yoyiq yozuvni tuzating."
        },
        {
          "ru": "В десятках первое число имеет пять, второе ноль. Первое число больше.",
          "uz": "O'nlarda birinchi sonda besh, ikkinchisida nol bor. Birinchi son katta."
        },
        {
          "ru": "Четыреста пятьдесят меньше пятисот. Выбираем нижнюю тысячу.",
          "uz": "To'rt yuz ellik besh yuzdan kichik. Quyi minglikni tanlaymiz."
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
      "ru": "Разряды и классы управляют записью числа",
      "uz": "Xonalar va sinflar son yozuvini boshqaradi"
    },
    "lead": {
      "ru": "Подготовка полного пакета завершена. Теперь каждое действие можно объяснить через место цифры.",
      "uz": "To'liq paket tayyor. Endi har bir harakatni raqamning o'rni orqali tushuntirish mumkin."
    },
    "instruction": {
      "ru": "Какие связи нужно сохранить?",
      "uz": "Qaysi bog'lanishlarni saqlash kerak?"
    },
    "model": {
      "kind": "reward",
      "badge": {
        "ru": "Пакет завершён",
        "uz": "Paket yakunlandi"
      },
      "number": {
        "ru": "КЛАСС → РАЗРЯД → ЗНАЧЕНИЕ",
        "uz": "SINF → XONA → QIYMAT"
      },
      "steps": [
        {
          "ru": "В каждом классе три разряда",
          "uz": "Har bir sinfda uchta xona bor"
        },
        {
          "ru": "Шаг влево увеличивает значение в десять раз",
          "uz": "Chapga qadam qiymatni o'n marta oshiradi"
        },
        {
          "ru": "Чтение, разложение, сравнение и округление используют разряды",
          "uz": "O'qish, yoyish, taqqoslash va yaxlitlash xonalardan foydalanadi"
        }
      ]
    },
    "result": {
      "ru": "место цифры определяет её значение",
      "uz": "raqam o'rni uning qiymatini belgilaydi"
    },
    "correctText": {
      "ru": "В позиционной записи значение цифры зависит от её места. Именно эта связь объединяет все действия сегодняшнего урока.",
      "uz": "Pozitsion yozuvda raqam qiymati uning o'rniga bog'liq. Aynan shu bog'lanish bugungi darsdagi barcha harakatlarni birlashtiradi."
    },
    "bridge": {
      "ru": "На следующем уроке сравним позиционные и непозиционные системы счисления.",
      "uz": "Keyingi darsda pozitsion va nopozitsion sanoq sistemalarini taqqoslaymiz."
    },
    "audio": {
      "intro": {
        "ru": [
          "В каждом классе три разряда. Место цифры определяет её значение и помогает выполнять все изученные действия."
        ],
        "uz": [
          "Har bir sinfda uchta xona bor. Raqam o'rni uning qiymatini belgilaydi va barcha o'rganilgan harakatlarga yordam beradi."
        ]
      },
      "on_correct": {
        "ru": "Следующий шаг покажет, чем позиционная запись отличается от непозиционной системы счисления.",
        "uz": "Keyingi qadam pozitsion yozuv nopozitsion sanoq sistemasidan qanday farq qilishini ko'rsatadi."
      }
    }
  }
};

const SCREEN_META = [
  { id: 's0', type: 'hook', subtype: 'complete-packet-mission', template: 'FoundationTheory', goal: 'Frame the integrated city data packet', misconceptions: ['each operation is unrelated'], active: false, scored: false, scope: 'hook', resetOnReturn: true },
  { id: 's1', type: 'exploration', subtype: 'classes-and-tenfold-shift', template: 'ShiftTheory', goal: 'Connect three-place classes with tenfold positional shifts', misconceptions: ['moving a digit does not change its value'], active: false, scored: false, scope: null, resetOnReturn: true },
  { id: 's2', type: 'exploration', subtype: 'class-boundary-million', template: 'BoundaryTheory', goal: 'Explain the transition from 999999 to the millions class', misconceptions: ['class groups are fixed to only two triples'], active: false, scored: false, scope: null, resetOnReturn: true },
  { id: 's3', type: 'exploration', subtype: 'read-write-expand', template: 'ModelReveal', goal: 'Read and expand one number from the same place table', misconceptions: ['internal zeros can be removed'], active: false, scored: false, scope: null, resetOnReturn: true },
  { id: 's4', type: 'exploration', subtype: 'four-form-invariant', template: 'InvariantTheory', goal: 'Connect standard notation, reading, place table, and expanded form', misconceptions: ['different representations mean different numbers'], active: false, scored: false, scope: null, resetOnReturn: true },
  { id: 's5', type: 'exploration', subtype: 'compare-and-round', template: 'AnimatedExplanation', goal: 'Use place structure for comparison and rounding', misconceptions: ['last digit decides comparison or rounding'], active: false, scored: false, scope: null, resetOnReturn: true },
  { id: 's6', type: 'rule', subtype: 'integrated-algorithm', template: 'RuleReveal', goal: 'Assemble the full read-expand-compare-round workflow', misconceptions: ['operations can ignore place structure'], active: false, scored: false, scope: null, resetOnReturn: false },
  { id: 's7', type: 'exploration', subtype: 'worked-packet', template: 'ModelReveal', goal: 'Follow a complete worked packet for 620405', misconceptions: ['zeros shift later digits'], active: false, scored: false, scope: null, resetOnReturn: false },
  { id: 's8', type: 'test', subtype: 'place-value-input', template: 'NumInputScreen', goal: 'Find the value of digit seven in 704018', misconceptions: ['digit confused with place value'], active: true, scored: true, scope: 'module-mikro', resetOnReturn: false },
  { id: 's9', type: 'exploration', subtype: 'worked-checkpoint', template: 'WorkedExamplesScreen', goal: 'Study four solved operations for 508070', misconceptions: ['place-value shifts'], active: false, scored: false, scope: null, resetOnReturn: false },
  { id: 's10', type: 'exploration', subtype: 'strategy-map', template: 'StrategyTheory', goal: 'Choose a model according to the mathematical task', misconceptions: ['one model is always best'], active: false, scored: false, scope: null, resetOnReturn: false },
  { id: 's11', type: 'case', subtype: 'multi-error-lab', template: 'ErrorWalkthrough', goal: 'Repair three related place-value failures', misconceptions: ['zeros are optional in standard form'], active: false, scored: false, scope: null, resetOnReturn: false },
  { id: 's12', type: 'case', subtype: 'two-packet-solution-lab', template: 'PacketSolutionLab', goal: 'Solve and compare two complete city data packets side by side', misconceptions: ['comparison and rounding use the same deciding digit'], active: false, scored: false, scope: null, resetOnReturn: false },
  { id: 's13', type: 'test', subtype: 'final-packet', template: 'MCScreen', goal: 'Choose the fully correct integrated packet for 306450', misconceptions: ['expansion, comparison, or rounding shifted'], active: true, scored: true, scope: 'final', resetOnReturn: false },
  { id: 's14', type: 'summary', subtype: 'positional-bridge', template: 'SummaryTheory', goal: 'Summarize place structure and bridge to numeral systems', misconceptions: ['digit value is independent of position'], active: false, scored: false, scope: null, resetOnReturn: false },
];

const TOTAL_SCREENS = 15;
const FREE_NAV = false;
const MOBILE_DESIGN_W = 390;
const NOTION_FLOW = SCREEN_META.map((meta, screen) => ({ screen, meta, contentKeys: [meta.id] }));

const LESSON_META = {
  lessonId: 'num-4-06-v1',
  lessonTitle: {
    ru: 'Урок 6. Разряды и классы чисел',
    uz: '6-dars. Sonlarning xonalari va sinflari',
  },
  skillTags: ['classes_and_places', 'tenfold_shift', 'class_boundary', 'representation_invariant', 'read_write', 'expanded_form', 'comparison', 'rounding', 'integrated_packet', 'solution_lab'],
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

const ShiftRoute = ({ model, t }) => {
  const values = model.number.split('→').map((value) => value.trim());
  return (
    <div className="shift-route" aria-label={model.number}>
      <div className="shift-track" aria-hidden="true" />
      {values.map((value, index) => (
        <div className="shift-stop" key={`${value}-${index}`} style={{ '--reveal-i': index }}>
          <strong>{value}</strong>
          <span>{t(model.steps[index])}</span>
          {index < values.length - 1 && <i aria-hidden="true">×10</i>}
        </div>
      ))}
    </div>
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
      {model.number && model.kind === 'shift' && <ShiftRoute model={model} t={t} />}
      {model.number && model.kind !== 'shift' && <div className="model-number">{t(model.number)}</div>}
      {model.groups && (
        <div className="class-groups">
          {model.groups.map((group, index) => (
            <div className={`class-group group-${group.tone ?? (index ? 'accent' : 'cyan')}`} key={`${group.value}-${index}`} style={{ '--reveal-i': index }}>
              <strong>{t(group.value)}</strong><span>{t(group.label)}</span>
            </div>
          ))}
        </div>
      )}
      {model.columns && (
        <div className="place-table" style={{ gridTemplateColumns: `repeat(${model.columns.length}, minmax(0, 1fr))` }}>
          {model.columns.map((column, index) => (
            <div className="place-cell" key={`${column.value}-${index}`} style={{ '--reveal-i': index }}>
              <span>{t(column.label)}</span><strong>{column.value}</strong>
            </div>
          ))}
        </div>
      )}
      {model.rows && (
        <div className={`model-rows ${model.rows.some((row) => String(t(row.value)).length > 20) ? 'model-rows-dense' : ''}`}>
          {model.rows.map((row, index) => (
            <div key={`${String(row.value)}-${index}`} style={{ '--reveal-i': index }}><span>{t(row.label)}</span><strong>{t(row.value)}</strong></div>
          ))}
        </div>
      )}
      {model.steps && model.kind !== 'shift' && (
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
  'awkward', 'present', 'think', 'point', 'idea', 'focus', 'point', 'present',
  'idea', 'nod', 'focus', 'present', 'think', 'awkward', 'happy',
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

const PacketSolutionLab = ({ screen, content, t }) => {
  const lang = useLang();
  const labels = lang === 'uz'
    ? { reading: "O'QILISHI", expanded: "YOYIQ YOZUV", comparison: 'TAQQOSLASH', rounded: 'MINGLIKKACHA' }
    : { reading: 'ЧТЕНИЕ', expanded: 'РАЗЛОЖЕНИЕ', comparison: 'СРАВНЕНИЕ', rounded: 'ДО ТЫСЯЧ' };

  return (
    <section className="packet-solution-lab" aria-label={t(content.instruction)}>
      <div className="packet-lab-question">
        <span>{lang === 'uz' ? "YECHIM YO'LI" : 'МАРШРУТ РЕШЕНИЯ'}</span>
        <strong>{t(content.instruction)}</strong>
      </div>
      <div className="packet-grid">
        {content.packets.map((packet, index) => (
          <article className={`packet-card packet-card-${index ? 'south' : 'north'}`} key={packet.number} style={{ '--reveal-i': index }}>
            <header><span>{t(packet.label)}</span><strong>{packet.number}</strong></header>
            <div className="packet-row"><i>{labels.reading}</i><b>{t(packet.reading)}</b></div>
            <div className="packet-row"><i>{labels.expanded}</i><b>{packet.expanded}</b></div>
            <div className="packet-row packet-row-accent"><i>{labels.comparison}</i><b>{packet.comparison}</b></div>
            <div className="packet-row packet-row-lime"><i>{labels.rounded}</i><b>{packet.rounded}</b></div>
            <p>{t(packet.note)}</p>
          </article>
        ))}
      </div>
      <TheoryCallout screen={screen} result={t(content.result)}>{t(content.correctText)}</TheoryCallout>
    </section>
  );
};

function useFinaleReveal(count = 4, interval = 500) {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    const reduced = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      const frame = requestAnimationFrame(() => setVisible(count));
      return () => cancelAnimationFrame(frame);
    }
    const resetFrame = requestAnimationFrame(() => setVisible(0));
    const timers = Array.from({ length: count }, (_, index) => (
      window.setTimeout(() => setVisible(index + 1), 300 + index * interval)
    ));
    return () => {
      cancelAnimationFrame(resetFrame);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [count, interval]);
  return visible;
}

const FinaleScreen = ({ screen, answers = [], onPrev, finishLesson }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s14;
  const segments = useMemo(() => [
    ...localizedSegments(c.audio?.intro ?? c.audio, lang, 's14-finale-intro'),
    ...localizedSegments(c.audio?.on_correct ?? c.correctText, lang, 's14-finale-result'),
  ], [c.audio, c.correctText, lang]);
  const audio = useAudio(segments);
  const visible = useFinaleReveal(4, 500);
  const scoredIndexes = useMemo(
    () => SCREEN_META.map((meta, index) => (meta.scored ? index : null)).filter((index) => index !== null),
    [],
  );
  const answered = scoredIndexes.filter((index) => answers[index] !== undefined).length;
  const firstTry = scoredIndexes.filter((index) => answers[index]?.firstTry === true).length;
  const complete = visible >= 4;
  const totalScored = scoredIndexes.length;
  const solvedCount = scoredIndexes.filter((index) => answers[index]?.correct === true).length;
  const rewardReady = complete && solvedCount === totalScored;
  const rewardTitle = firstTry === totalScored
    ? { ru: 'Эксперт по числам', uz: 'Sonlar eksperti' }
    : firstTry >= Math.max(1, totalScored - 1)
      ? { ru: 'Мастер числовой системы', uz: 'Sonlar tizimi ustasi' }
      : { ru: 'Исследователь данных', uz: "Ma'lumotlar tadqiqotchisi" };

  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<><NavBack onClick={onPrev} /><NavNext onClick={finishLesson} disabled={false} finish /></>}>
      <div className="screen-stack finale-screen">
        <header className="finale-heading">
          <span>{lang === 'uz' ? 'YAKUNIY BOSQICH' : 'ФИНАЛЬНЫЙ ЭТАП'}</span>
          <h1>{t(c.title)}</h1>
          <p>{lang === 'uz'
            ? "Dars boshidagi 704 018 ma'lumot paketi to'liq yig'ildi. Sinf, xona va qiymat bog'langani uchun Lumo City yo'nalishi ochildi."
            : 'Пакет данных 704 018 из начала урока полностью собран. Классы, разряды и значения связаны — маршрут Lumo City открыт.'}</p>
        </header>
        <div className="finale-layout">
          <div className="finale-main">
            <div className="finale-mastery">
              {c.model.steps.map((item, index) => (
                <article className={`finale-takeaway ${visible >= index + 1 ? 'is-visible' : ''}`} key={t(item)}><span>{String(index + 1).padStart(2, '0')}</span><p>{t(item)}</p></article>
              ))}
            </div>
            <div className={`finale-proof ${visible >= 3 ? 'is-visible' : ''}`}>
              <span>{lang === 'uz' ? "BOSHLANG'ICH MISSIYA YECHIMI" : 'РЕШЕНИЕ СТАРТОВОЙ МИССИИ'}</span><strong>{t(c.model.number)}</strong><p>{t(c.correctText)}</p>
            </div>
            <div className={`finale-bridge ${complete ? 'is-visible' : ''}`}><span aria-hidden="true">→</span><div><strong>{lang === 'uz' ? 'KEYINGI MISSIYA' : 'СЛЕДУЮЩАЯ МИССИЯ'}</strong><p>{t(c.bridge)}</p></div></div>
          </div>
          <aside className={`finale-reward ${rewardReady ? 'is-complete' : ''}`} role="status" aria-live="polite" aria-atomic="true">
            {rewardReady && <div className="finale-confetti" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <i key={index} />)}</div>}
            <div className="finale-medal" aria-hidden="true">{rewardReady ? '★' : '🔒'}</div>
            <div className="finale-reward-copy">
              <span>{rewardReady ? (lang === 'uz' ? 'UNVON OLINDI' : 'ЗВАНИЕ ПОЛУЧЕНО') : (lang === 'uz' ? 'MUKOFOT KUTILMOQDA' : 'НАГРАДА ЖДЁТ')}</span>
              <h2>{rewardReady ? t(rewardTitle) : (lang === 'uz' ? 'Unvonni oching' : 'Открой звание')}</h2>
              {!complete ? (
                <div className="finale-status finale-status-neutral"><strong>…</strong><p>{lang === 'uz' ? 'Bilimlar jamlanmoqda' : 'Знания собираются вместе'}</p></div>
              ) : rewardReady ? (
                <div className="finale-status"><strong>{firstTry}/{scoredIndexes.length}</strong><p>{lang === 'uz' ? 'birinchi urinishda' : 'с первой попытки'}</p><small>{answered}/{scoredIndexes.length} {lang === 'uz' ? 'mashq bajarildi' : 'заданий выполнено'}</small></div>
              ) : (
                <div className="finale-status finale-status-neutral"><strong>{solvedCount}/{totalScored}</strong><p>{lang === 'uz' ? 'yechildi' : 'решено'}</p><small>{answered}/{totalScored} {lang === 'uz' ? 'mashq bajarildi' : 'заданий выполнено'}</small></div>
              )}
            </div>
            <div className="finale-reward-bit"><BitSVG state={rewardReady ? 'happy' : 'present'} /></div>
          </aside>
        </div>
      </div>
    </Stage>
  );
};

const TheoryScreen = ({ screen, onNext, onPrev, finishLesson }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[`s${screen}`];
  const meta = SCREEN_META[screen];
  const isFinal = screen === TOTAL_SCREENS - 1;
  const resultSource = c.result ?? c.correctValue ?? c.options?.[c.correctIndex];
  const result = resultSource ? formatTheoryResult(resultSource, t) : '';
  const segments = useMemo(() => [
    ...localizedSegments(c.audio?.intro ?? c.audio, lang, `s${screen}-intro`),
    ...localizedSegments(c.audio?.on_correct, lang, `s${screen}-explanation`),
  ], [c.audio, lang, screen]);
  const audio = useAudio(segments);
  const canContinue = useCanAnswer(audio);
  const isFoundation = meta.template === 'FoundationTheory' || meta.template === 'RecapTheory';
  const isRule = meta.template === 'RuleReveal';
  const isStrategy = meta.template === 'StrategyTheory';
  const isError = meta.template === 'ErrorWalkthrough';
  const isPacketLab = meta.template === 'PacketSolutionLab';
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

        {!isFoundation && !isSummary && !isPacketLab && <ModelPanel model={c.model} theory />}

        {!isFoundation && !isRule && !isStrategy && !isError && !isPacketLab && !isSummary && (
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
            <div className="rule-ribbon"><span>1</span><b>{lang === 'uz' ? "Sinflarga ajrating va o'qing" : 'Раздели на классы и прочитай'}</b></div>
            <div className="rule-ribbon"><span>2</span><b>{lang === 'uz' ? 'Xona qiymatlariga yoying' : 'Разложи по разрядным значениям'}</b></div>
            <div className="rule-ribbon"><span>3</span><b>{lang === 'uz' ? "Chapdan taqqoslang" : 'Сравни слева направо'}</b></div>
            <div className="rule-ribbon"><span>4</span><b>{lang === 'uz' ? 'Kerakli aniqlikkacha yaxlitlang' : 'Округли до нужной точности'}</b></div>
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

        {isError && c.repairs && (
          <section className="multi-error-lab">
            {c.repairs.map((repair, index) => (
              <article className="repair-card" key={`${repair.before}-${index}`} style={{ '--reveal-i': index }}>
                <span>{t(repair.label)}</span>
                <div><s>{repair.before}</s><i aria-hidden="true">→</i><strong>{repair.after}</strong></div>
                <p>{t(repair.text)}</p>
              </article>
            ))}
            <TheoryCallout screen={screen} result={result} tone="cyan">{t(c.correctText)}</TheoryCallout>
          </section>
        )}

        {isError && !c.repairs && (
          <section className="error-walkthrough">
            <div className="error-state error-before">
              <span>{lang === 'uz' ? 'XATO YOZUV' : 'ОШИБОЧНАЯ ЗАПИСЬ'}</span>
              <strong>{c.model.rows[0].value}</strong>
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

        {isPacketLab && <PacketSolutionLab screen={screen} content={c} t={t} />}

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
  const canContinue = useCanAnswer(audio);

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
                <strong>{t(item.answer ?? item.options?.[item.correctIndex])}</strong>
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

const ChoiceScreen = ({ screen, storedAnswer, onAnswer, onNext, onPrev, finishLesson }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[`s${screen}`];
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
      skillTag: SCREEN_META[screen].scope,
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

const NumericInputScreen = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT['s' + screen];
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

const SCREENS = [
  TheoryScreen,
  TheoryScreen,
  TheoryScreen,
  TheoryScreen,
  TheoryScreen,
  TheoryScreen,
  TheoryScreen,
  TheoryScreen,
  NumericInputScreen,
  WorkedExamplesScreen,
  TheoryScreen,
  TheoryScreen,
  TheoryScreen,
  ChoiceScreen,
  FinaleScreen,
];

export default function Grade4Dars06({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished }) {
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
    else console.log('[Grade4 Dars06 preview]', payload);
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
  top: 9px;
  right: 9px;
  z-index: 30;
  display: flex;
  gap: 3px;
  padding: 3px;
  border-radius: 999px;
  background: rgba(255,255,255,.94);
  box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},.6);
}
.preview-language button {
  padding: 4px 9px;
  border: 0;
  border-radius: 999px;
  color: ${T.ink2};
  background: transparent;
  cursor: pointer;
  font-size: 10px;
  font-weight: 900;
}
.preview-language .preview-active { color: #FFFFFF; background: ${T.accent}; }
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
.stage-chrome {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.chrome-title, .chrome-actions, .audio-controls {
  display: flex;
  align-items: center;
  gap: 9px;
}
.chrome-title {
  min-width: 0;
  color: ${T.ink2};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.chrome-title > span:last-child { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.status-dot {
  width: 8px;
  height: 8px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: ${T.accent};
  box-shadow: 0 0 10px rgba(255,91,53,.65);
}
.chrome-actions { flex: 0 0 auto; }
.screen-type {
  padding: 4px 8px;
  border-radius: 999px;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-size: 10px;
  font-weight: 800;
}
.screen-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
}
.icon-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 10px;
  color: ${T.ink2};
  background: rgba(255,255,255,.75);
  cursor: pointer;
  box-shadow: 0 4px 12px -7px rgba(${T.shadowBase},.3);
}
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
.btn-white-accent.btn-ready:hover { color: ${T.paper}; background: ${T.accent}; transform: translateY(-1px); box-shadow: 0 12px 28px -6px rgba(255,91,53,.50); }
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
.model-number { position: relative; z-index: 1; font-family: 'JetBrains Mono', monospace; font-size: clamp(31px, 6vw, 52px); font-weight: 800; letter-spacing: .08em; text-align: center; white-space: pre-wrap; }
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
.model-rows-dense strong { max-width: 72%; font-size: clamp(12px, 2vw, 17px); line-height: 1.35; text-align: right; white-space: normal; }
.model-boundary .model-number { font-size: clamp(28px, 5vw, 46px); }
.model-boundary .class-group strong { font-size: clamp(22px, 3.8vw, 34px); white-space: nowrap; }
.model-steps { position: relative; z-index: 1; list-style: none; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 9px; counter-reset: none; }
.model-steps li { min-height: 64px; padding: 11px; display: flex; align-items: center; justify-content: center; border-radius: 12px; background: rgba(255,255,255,.10); text-align: center; font-size: 12px; line-height: 1.35; font-weight: 720; }
.model-solved { box-shadow: 0 15px 34px -18px rgba(34,122,83,.58), inset 0 0 0 2px rgba(149,201,61,.26); }
.shift-route {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 14px;
}
.shift-track {
  position: absolute;
  z-index: -1;
  left: 5%;
  right: 5%;
  top: 37px;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, ${T.cyan}, ${T.lime});
  box-shadow: 0 0 12px rgba(149,201,61,.35);
  transform-origin: left;
  animation: shift-track-grow 1.25s cubic-bezier(.16,1,.3,1) .18s both;
}
.shift-stop {
  position: relative;
  min-width: 0;
  min-height: 91px;
  padding: 11px 5px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border: 1px solid rgba(121,211,218,.17);
  border-radius: 13px;
  background: rgba(255,255,255,.10);
  animation: shift-stop-in .68s cubic-bezier(.16,1,.3,1) both;
  animation-delay: calc(.24s + var(--reveal-i, 0) * .14s);
}
.shift-stop strong { font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2vw, 18px); white-space: nowrap; }
.shift-stop span { color: rgba(255,255,255,.68); font-size: 8px; line-height: 1.2; text-align: center; }
.shift-stop i {
  position: absolute;
  z-index: 3;
  right: -16px;
  top: 29px;
  padding: 2px 4px;
  border-radius: 6px;
  color: ${T.navy};
  background: ${T.lime};
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  font-style: normal;
  font-weight: 900;
}
.model-shift .class-groups { margin-top: 2px; }
@keyframes shift-track-grow { from { transform: scaleX(0); opacity: 0; } to { transform: scaleX(1); opacity: 1; } }
@keyframes shift-stop-in { from { opacity: 0; transform: translateX(-16px) scale(.9); } to { opacity: 1; transform: translateX(0) scale(1); } }
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
  gap: 12px;
  align-items: stretch;
}
.foundation-layout > .model-panel {
  width: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.foundation-layout .model-city .model-rows {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
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
  grid-template-columns: minmax(0, 1fr);
  gap: 10px;
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
.animated-explanation > .theory-focus,
.animated-explanation > .theory-callout {
  width: 100%;
  min-height: 0;
}
.animated-explanation > .theory-focus { padding: 14px 16px; }
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
.multi-error-lab { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.repair-card {
  min-height: 146px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 9px;
  border: 1px solid rgba(22,143,163,.14);
  border-radius: 17px;
  background: ${T.paper};
  box-shadow: 0 12px 28px -22px rgba(${T.shadowBase},.38);
  animation: theory-item-in .68s cubic-bezier(.16,1,.3,1) both;
  animation-delay: calc(.24s + var(--reveal-i, 0) * .16s);
}
.repair-card > span { color: ${T.cyan}; font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 900; letter-spacing: .11em; }
.repair-card > div { display: flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 900; }
.repair-card s { color: ${T.warn}; text-decoration-thickness: 2px; }
.repair-card i { color: ${T.accent}; font-style: normal; }
.repair-card strong { color: ${T.success}; }
.repair-card p { margin-top: auto; color: ${T.ink2}; font-size: 11px; line-height: 1.42; }
.multi-error-lab > .theory-callout { grid-column: 1 / -1; }
.packet-solution-lab { display: grid; gap: 11px; }
.packet-lab-question {
  min-height: 64px;
  padding: 12px 16px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 14px;
  border-radius: 16px;
  color: ${T.navy};
  background: ${T.accentSoft};
  box-shadow: inset 4px 0 0 ${T.accent}, 0 10px 24px -20px rgba(${T.shadowBase},.34);
  animation: theory-copy-in .62s cubic-bezier(.16,1,.3,1) .16s both;
}
.packet-lab-question > span { color: ${T.accent}; font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 900; letter-spacing: .1em; }
.packet-lab-question > strong { font-family: 'Source Serif 4', Georgia, serif; font-size: 17px; line-height: 1.3; }
.packet-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 11px; }
.packet-card {
  min-width: 0;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid rgba(22,143,163,.14);
  border-radius: 18px;
  background: ${T.paper};
  box-shadow: 0 16px 32px -24px rgba(${T.shadowBase},.44);
  animation: theory-item-in .68s cubic-bezier(.16,1,.3,1) both;
  animation-delay: calc(.3s + var(--reveal-i, 0) * .18s);
}
.packet-card-north { box-shadow: inset 4px 0 0 ${T.cyan}, 0 16px 32px -24px rgba(${T.shadowBase},.44); }
.packet-card-south { box-shadow: inset 4px 0 0 ${T.accent}, 0 16px 32px -24px rgba(${T.shadowBase},.44); }
.packet-card > header { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding-bottom: 7px; }
.packet-card > header span { color: ${T.cyan}; font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 900; letter-spacing: .1em; }
.packet-card-south > header span { color: ${T.accent}; }
.packet-card > header strong { color: ${T.navy}; font-family: 'JetBrains Mono', monospace; font-size: clamp(20px, 3vw, 27px); white-space: nowrap; }
.packet-row { min-height: 49px; padding: 8px 10px; display: grid; align-content: center; gap: 4px; border-radius: 12px; background: ${T.bg}; }
.packet-row > i { color: ${T.ink2}; font-family: 'JetBrains Mono', monospace; font-size: 8px; font-style: normal; font-weight: 900; letter-spacing: .1em; }
.packet-row > b { color: ${T.navy}; font-size: 11px; line-height: 1.38; overflow-wrap: anywhere; }
.packet-row-accent { background: ${T.cyanSoft}; }
.packet-row-accent > b { font-family: 'JetBrains Mono', monospace; color: ${T.cyan}; font-size: 14px; }
.packet-row-lime { background: ${T.successSoft}; }
.packet-row-lime > b { font-family: 'JetBrains Mono', monospace; color: ${T.success}; font-size: 14px; }
.packet-card > p { margin-top: auto; color: ${T.ink2}; font-size: 11px; line-height: 1.42; }
.packet-solution-lab > .theory-callout { animation-delay: .7s; }
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
.summary-core { display: grid; grid-template-columns: minmax(0, 1fr); gap: 11px; align-items: stretch; }
.summary-core .model-panel, .summary-core .theory-callout { width: 100%; min-height: 0; }
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
.finale-screen { gap: 10px; }
.finale-heading { min-width: 0; padding: 12px 15px; border-radius: 17px; background: linear-gradient(135deg,${T.paper},${T.cyanSoft}); box-shadow: 0 12px 28px -22px rgba(${T.shadowBase},.38); }.finale-heading > span { display: block; margin-bottom: 4px; color: ${T.accent}; font: 900 9px/1 'JetBrains Mono',monospace; letter-spacing: .15em; }.finale-heading h1 { color: ${T.navy}; font: 650 clamp(20px,3vw,28px)/1.08 'Source Serif 4',serif; overflow-wrap: anywhere; }.finale-heading p { max-width: 760px; margin-top: 5px; color: ${T.ink2}; font-size: 12px; line-height: 1.42; overflow-wrap: anywhere; }
.finale-layout { min-width: 0; display: grid; grid-template-columns: minmax(0,1fr) minmax(248px,.42fr); gap: 10px; align-items: stretch; }.finale-main { min-width: 0; display: flex; flex-direction: column; gap: 9px; }.finale-mastery { min-width: 0; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 8px; }
.finale-takeaway { min-width: 0; min-height: 88px; padding: 10px; display: grid; grid-template-columns: 28px minmax(0,1fr); align-items: start; gap: 7px; border-radius: 14px; background: ${T.paper}; box-shadow: 0 10px 24px -19px rgba(${T.shadowBase},.36); opacity: 0; transform: translateY(8px); transition: opacity .34s ease,transform .34s ease; }.finale-takeaway.is-visible { opacity: 1; transform: none; }.finale-takeaway > span { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 9px; color: ${T.paper}; background: ${T.cyan}; font: 900 10px/1 'JetBrains Mono',monospace; }.finale-takeaway:nth-child(2) > span { background: ${T.accent}; }.finale-takeaway:nth-child(3) > span { background: ${T.success}; }.finale-takeaway p { color: ${T.ink}; font-size: 11px; line-height: 1.38; font-weight: 720; overflow-wrap: anywhere; }
.finale-proof,.finale-bridge { min-width: 0; opacity: 0; transform: translateY(7px); transition: opacity .34s ease,transform .34s ease; }.finale-proof.is-visible,.finale-bridge.is-visible { opacity: 1; transform: none; }.finale-proof { padding: 9px 12px; display: grid; grid-template-columns: auto minmax(0,.7fr) minmax(0,1.3fr); align-items: center; gap: 9px; border-radius: 13px; background: ${T.successSoft}; box-shadow: inset 4px 0 0 ${T.success}; }.finale-proof > span,.finale-bridge strong { color: ${T.success}; font: 900 9px/1.2 'JetBrains Mono',monospace; letter-spacing: .1em; }.finale-proof > strong { min-width: 0; color: ${T.navy}; font: 800 12px/1.25 'JetBrains Mono',monospace; overflow-wrap: anywhere; }.finale-proof p,.finale-bridge p { color: ${T.ink2}; font-size: 11px; line-height: 1.35; overflow-wrap: anywhere; }
.finale-bridge { padding: 9px 11px; display: grid; grid-template-columns: 30px minmax(0,1fr); align-items: center; gap: 9px; border-radius: 13px; background: ${T.accentSoft}; }.finale-bridge > span { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 10px; color: ${T.paper}; background: ${T.accent}; font-weight: 900; }.finale-bridge strong { color: ${T.accent}; }.finale-bridge p { margin-top: 3px; }
.finale-reward { position: relative; min-width: 0; min-height: 206px; padding: 15px 76px 14px 62px; display: flex; align-items: center; overflow: hidden; border-radius: 18px; color: ${T.paper}; background: linear-gradient(145deg,${T.navy},#0f2c40); box-shadow: 0 16px 32px -22px rgba(${T.shadowBase},.58); }.finale-reward-copy { position: relative; z-index: 2; min-width: 0; }.finale-reward-copy > span { color: ${T.lime}; font: 900 9px/1.2 'JetBrains Mono',monospace; letter-spacing: .12em; }.finale-reward-copy h2 { margin-top: 5px; font: 650 19px/1.05 'Source Serif 4',serif; overflow-wrap: anywhere; }.finale-status { margin-top: 10px; }.finale-status strong { display: block; color: ${T.lime}; font: 850 25px/1 'JetBrains Mono',monospace; }.finale-status p { margin-top: 3px; font-size: 11px; line-height: 1.25; font-weight: 800; }.finale-status small { display: block; margin-top: 3px; color: rgba(255,255,255,.68); font-size: 9px; line-height: 1.3; }.finale-status-neutral strong { font-size: 22px; }
.finale-medal { position: absolute; z-index: 2; left: 11px; top: 50%; width: 39px; height: 39px; display: grid; place-items: center; border-radius: 50%; color: ${T.navy}; background: ${T.lime}; box-shadow: 0 0 0 5px rgba(149,201,61,.14); transform: translateY(-50%) scale(.78); transition: transform .38s ease; }.finale-reward.is-complete .finale-medal { transform: translateY(-50%) scale(1); }.finale-reward-bit { position: absolute; z-index: 1; right: 1px; bottom: -5px; width: 76px; height: 96px; }.finale-reward-bit .g1-char { width: 100%; height: 100%; }.finale-reward.is-complete .finale-reward-bit { animation: finale-bit-float 3.2s ease-in-out infinite; }
.finale-confetti i { position: absolute; z-index: 0; top: 12px; left: 20%; width: 5px; height: 9px; border-radius: 3px; background: ${T.lime}; opacity: 0; }.finale-confetti i:nth-child(2) { left: 34%; background: ${T.accent}; transform: rotate(24deg); }.finale-confetti i:nth-child(3) { left: 49%; background: ${T.cyan}; transform: rotate(-20deg); }.finale-confetti i:nth-child(4) { left: 63%; top: 22px; background: ${T.paper}; }.finale-confetti i:nth-child(5) { left: 78%; background: ${T.accent}; transform: rotate(38deg); }.finale-confetti i:nth-child(6) { left: 27%; top: 34px; background: ${T.cyan}; }.finale-confetti i:nth-child(7) { left: 57%; top: 42px; background: ${T.lime}; transform: rotate(-34deg); }.finale-confetti i:nth-child(8) { left: 86%; top: 34px; background: ${T.paper}; }.finale-reward.is-complete .finale-confetti i { animation: finale-confetti-fall 1.45s ease-out both; }.finale-reward.is-complete .finale-confetti i:nth-child(even) { animation-delay: .1s; }
@keyframes finale-bit-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes finale-confetti-fall { 0% { opacity: 0; translate: 0 -8px; } 20% { opacity: .9; } 100% { opacity: 0; translate: 5px 78px; rotate: 160deg; } }
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
  .foundation-layout, .summary-core { grid-template-columns: 1fr; }
  .foundation-layout > .model-panel, .summary-core .model-panel, .summary-core .theory-callout { min-height: 0; }
  .rule-reveal { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .options-grid { grid-template-columns: 1fr; }
  .finale-layout { grid-template-columns: 1fr; }
  .finale-reward { min-height: 132px; }
}
@media (max-width: 639.98px) {
  .lesson-root { width: 390px; }
  .stage { width: 390px; }
  .stage-header { padding-top: 10px; padding-bottom: 8px; }
  .stage-content { padding-top: 10px; padding-bottom: 18px; scrollbar-width: none; }
  .stage-content::-webkit-scrollbar { display: none; }
  .stage-nav { min-height: 66px; padding-top: 8px; }
  .screen-type { display: none; }
  .chrome-title { max-width: 170px; font-size: 11px; }
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
  .model-boundary .model-number { font-size: 23px; letter-spacing: .02em; white-space: nowrap; }
  .model-boundary .class-group strong { font-size: 17px; }
  .class-groups { gap: 7px; }
  .class-group { min-height: 72px; }
  .class-group strong { font-size: 27px; }
  .class-group span { font-size: 10px; }
  .place-table { gap: 4px; }
  .place-cell { min-height: 64px; padding: 5px 2px; }
  .place-cell span { min-height: 24px; font-size: 7px; }
  .place-cell strong { font-size: 20px; }
  .model-steps { grid-template-columns: 1fr; gap: 5px; }
  .model-steps li { min-height: 42px; padding: 8px; }
  .shift-route { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
  .shift-track { display: none; }
  .shift-stop { min-height: 72px; padding: 8px 3px 6px; }
  .shift-stop strong { font-size: 13px; }
  .shift-stop span { font-size: 7px; }
  .shift-stop i { right: -12px; top: 24px; font-size: 7px; }
  .shift-stop:nth-child(4) i { display: none; }
  .foundation-layout, .animated-explanation, .strategy-walkthrough, .summary-core { grid-template-columns: 1fr; }
  .foundation-layout .model-city .model-rows { grid-template-columns: 1fr; }
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
  .multi-error-lab { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 6px; }
  .repair-card { min-height: 0; padding: 9px; gap: 6px; }
  .repair-card:last-of-type { grid-column: 1 / -1; }
  .repair-card p { font-size: 10px; }
  .packet-solution-lab { gap: 7px; }
  .packet-lab-question { min-height: 0; padding: 10px 12px; grid-template-columns: 1fr; gap: 5px; }
  .packet-lab-question > strong { font-size: 15px; }
  .packet-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 6px; }
  .packet-card { padding: 8px; gap: 5px; }
  .packet-card > header { align-items: flex-start; gap: 4px; padding-bottom: 3px; }
  .packet-card > header span { font-size: 8px; }
  .packet-card > header strong { font-size: 17px; }
  .packet-row { min-height: 38px; padding: 6px; }
  .packet-row > i { font-size: 7px; }
  .packet-row > b { font-size: 9px; line-height: 1.28; }
  .packet-row-accent > b, .packet-row-lime > b { font-size: 11px; }
  .packet-card > p { font-size: 9px; line-height: 1.32; }
  .error-state { min-height: 0; padding: 14px; }
  .repair-arrow { min-height: 28px; font-size: 0; }
  .repair-arrow::before { content: '↓'; font-size: 24px; }
  .summary-core .model-panel, .summary-core .theory-callout { min-height: 0; }
  .summary-bridge { padding: 11px 13px; }
  .worked-example-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 6px; }
  .worked-example { min-height: 0; padding: 9px; grid-template-columns: 30px minmax(0, 1fr); gap: 7px; }
  .worked-index { width: 30px; height: 30px; font-size: 10px; }
  .worked-copy { gap: 4px; }
  .worked-copy h2 { font-size: 13px; }
  .worked-copy > strong { font-size: 14px; }
  .worked-copy > p { font-size: 10px; }
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
  .lesson-root-preview .stage-header { padding-top: 60px; }
  .finale-heading { padding: 11px 12px; }.finale-heading h1 { font-size: 22px; }.finale-mastery { grid-template-columns: 1fr; gap: 6px; }.finale-takeaway { min-height: 0; padding: 8px 9px; }.finale-proof { grid-template-columns: 1fr; gap: 5px; }.finale-reward { min-height: 116px; padding: 11px 65px 11px 51px; }.finale-reward-copy h2 { font-size: 17px; }.finale-medal { left: 8px; width: 34px; height: 34px; }.finale-reward-bit { width: 62px; height: 78px; }
}
@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after {
    animation-duration: .01ms !important;
    animation-delay: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    transition-delay: 0ms !important;
    scroll-behavior: auto !important;
  }
  .finale-takeaway,.finale-proof,.finale-bridge { opacity: 1 !important; transform: none !important; }
  .finale-confetti { display: none; }
}
`;
