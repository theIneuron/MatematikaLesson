import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Bo'luvchini aniqlash",
    "ru": "Практика к уроку 1. Делители и кратные",
    "en": "Finding a divisor"
  },
  "prompt": {
    "uz": "36 sonining bo'luvchisini toping.",
    "ru": "Найдите делитель числа 36.",
    "en": "Find a divisor of 36."
  },
  "options": [
    "5",
    "7",
    "9",
    "11"
  ],
  "answer": "9",
  "explanation": {
    "uz": "36 : 9 = 4 va qoldiq yo'q. Shuning uchun 9 soni 36 ning bo'luvchisidir.",
    "ru": "Правильный ответ: 9. Делитель делит число без остатка, а кратное получается умножением на натуральное число.",
    "en": "36 : 9 = 4 with no remainder. That is why 9 is a divisor of 36."
  }
};

export default function D01_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={1} task={1}/>;
}
