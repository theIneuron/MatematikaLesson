import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Sodda ko'rinishlar",
    "ru": "Практика к уроку 8. Сокращение дробей"
  },
  "prompt": {
    "uz": "Kasrlarni eng sodda ko'rinishi bilan bog'lang.",
    "ru": "Соедините дроби с их простейшим видом."
  },
  "left": [
    "22/44",
    "39/52",
    "45/63"
  ],
  "right": [
    "1/2",
    "3/4",
    "5/7"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "22/44 = 1/2, 39/52 = 3/4, 45/63 = 5/7.",
    "ru": "Все пары найдены правильно. Для полного сокращения числитель и знаменатель делят на их НОД."
  }
};

export default function D08_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={8} task={6}/>;
}
