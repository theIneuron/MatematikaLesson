import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Bir nechta bo'linish belgisi",
    "ru": "Практика к уроку 2. Признаки делимости на 2, 5 и 10"
  },
  "prompt": {
    "uz": "Sonlarni mos tavsif bilan bog'lang.",
    "ru": "Соедините числа с верным описанием их делимости."
  },
  "left": [
    "1260",
    "1275",
    "1284"
  ],
  "right": [
    "faqat 2 ga",
    "faqat 5 ga",
    "2, 5 va 10 ga"
  ],
  "pairs": [
    2,
    1,
    0
  ],
  "translationsRu": {
    "faqat 2 ga": "только на 2",
    "faqat 5 ga": "только на 5",
    "2, 5 va 10 ga": "на 2, 5 и 10"
  },
  "explanation": {
    "uz": "1260 uchalasiga, 1275 faqat 5 ga, 1284 esa faqat 2 ga bo'linadi.",
    "ru": "Все пары найдены правильно. Для делимости на 2, 5 и 10 достаточно проверить последнюю цифру."
  }
};

export default function D02_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={2} task={9}/>;
}
