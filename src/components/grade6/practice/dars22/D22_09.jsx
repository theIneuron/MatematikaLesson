import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Foiz formulalari",
    "ru": "Практика к уроку 22. Задачи на проценты"
  },
  "prompt": {
    "uz": "Masala turini unda ishlatiladigan asosiy formula bilan moslashtiring.",
    "ru": "Соедините вид процентной задачи с основной формулой."
  },
  "left": [
    "Sonning foizini topish",
    "Foiziga ko'ra butunni topish",
    "Qism necha foizligini topish"
  ],
  "right": [
    "Qism : butun × 100",
    "Qism : foizning o‘nli yozuvi",
    "Butun × foizning o‘nli yozuvi"
  ],
  "pairs": [
    2,
    1,
    0
  ],
  "translationsRu": {
    "Sonning foizini topish": "Найти процент от числа",
    "Foiziga ko'ra butunni topish": "Найти целое по его проценту",
    "Qism necha foizligini topish": "Найти, сколько процентов составляет часть",
    "Qism : butun × 100": "Часть : целое × 100",
    "Qism : foizning o‘nli yozuvi": "Часть : десятичную запись процента",
    "Butun × foizning o‘nli yozuvi": "Целое × десятичную запись процента"
  },
  "explanation": {
    "uz": "Foiz qismi ko'paytirish, butun bo'lish, qismning foizi esa qism : butun × 100 bilan topiladi.",
    "ru": "Все пары найдены правильно. Новое значение находят умножением начального значения на коэффициент изменения."
  }
};

export default function D22_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={22} task={9}/>;
}
