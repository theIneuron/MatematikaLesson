import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Tub ko'paytuvchilar",
    "ru": "Практика к уроку 4. Простые и составные числа"
  },
  "prompt": {
    "uz": "Sonlarni tub ko'paytuvchilarga yoyilmasi bilan moslashtiring.",
    "ru": "Соедините числа с их разложением на простые множители."
  },
  "left": [
    "20",
    "42",
    "75"
  ],
  "right": [
    "2² × 5",
    "2 × 3 × 7",
    "3 × 5²"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "20 = 2² × 5, 42 = 2 × 3 × 7, 75 = 3 × 5².",
    "ru": "Все пары найдены правильно. Простое число имеет ровно два натуральных делителя."
  }
};

export default function D04_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={4} task={6}/>;
}
