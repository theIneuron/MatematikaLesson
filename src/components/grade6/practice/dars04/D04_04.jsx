import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Murakkab sonni aniqlash",
    "ru": "Практика к уроку 4. Простые и составные числа"
  },
  "prompt": {
    "uz": "Murakkab sonni toping.",
    "ru": "Найдите составное число."
  },
  "options": [
    "17",
    "19",
    "25",
    "29"
  ],
  "answer": "25",
  "explanation": {
    "uz": "25 = 5 × 5, demak u murakkab son.",
    "ru": "Правильный ответ: 25. Простое число имеет ровно два натуральных делителя."
  }
};

export default function D04_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={4} task={4}/>;
}
