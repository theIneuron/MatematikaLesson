import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Bo'linish xususiyatlari",
    "ru": "Практика к уроку 2. Признаки делимости на 2, 5 и 10"
  },
  "prompt": {
    "uz": "Sonlarni mos bo'linish xususiyati bilan bog'lang.",
    "ru": "Соедините числа с подходящими признаками делимости."
  },
  "left": [
    "246",
    "375",
    "920"
  ],
  "right": [
    "faqat 2 ga",
    "faqat 5 ga",
    "2, 5 va 10 ga"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "faqat 2 ga": "только на 2",
    "faqat 5 ga": "только на 5",
    "2, 5 va 10 ga": "на 2, 5 и 10"
  },
  "explanation": {
    "uz": "246 faqat 2 ga, 375 faqat 5 ga, 920 esa 2, 5 va 10 ga bo'linadi.",
    "ru": "Все пары найдены правильно. Для делимости на 2, 5 и 10 достаточно проверить последнюю цифру."
  }
};

export default function D02_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={2} task={3}/>;
}
