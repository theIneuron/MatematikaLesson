import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Yoyilmalarni moslashtirish",
    "ru": "Практика к уроку 4. Простые и составные числа"
  },
  "prompt": {
    "uz": "84, 90 va 126 sonlarini tub ko'paytuvchilarga ajrating, so'ng har bir sonni o'zining to'liq yoyilmasi bilan moslashtiring.",
    "ru": "Разложите 84, 90 и 126 на простые множители и соедините с правильным ответом."
  },
  "left": [
    "84",
    "90",
    "126"
  ],
  "right": [
    "2² × 3 × 7",
    "2 × 3² × 5",
    "2 × 3² × 7"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "84 = 2² × 3 × 7, 90 = 2 × 3² × 5, 126 = 2 × 3² × 7.",
    "ru": "Все пары найдены правильно. Простое число имеет ровно два натуральных делителя."
  }
};

export default function D04_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={4} task={9}/>;
}
