import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Tub sonni aniqlash",
    "ru": "Практика к уроку 4. Простые и составные числа",
    "en": "Spotting a prime number"
  },
  "prompt": {
    "uz": "Tub sonni toping.",
    "ru": "Найдите простое число.",
    "en": "Find the prime number."
  },
  "options": [
    "11",
    "15",
    "21",
    "27"
  ],
  "answer": "11",
  "explanation": {
    "uz": "11 ning faqat 1 va 11 bo'luvchilari bor, shuning uchun u tub son.",
    "ru": "Правильный ответ: 11. Простое число имеет ровно два натуральных делителя.",
    "en": "11 has only the divisors 1 and 11, so it is a prime number."
  }
};

export default function D04_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={4} task={1}/>;
}
