import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Tub bo'luvchini topish",
    "ru": "Практика к уроку 4. Простые и составные числа",
    "en": "Finding a prime divisor"
  },
  "prompt": {
    "uz": "91 sonining eng kichik tub bo'luvchisini topib yozing.",
    "ru": "Запишите наименьший простой делитель числа 91.",
    "en": "Find the smallest prime divisor of 91 and write it down."
  },
  "answer": "7",
  "explanation": {
    "uz": "91 = 7 × 13. Uning eng kichik tub bo'luvchisi 7.",
    "ru": "Правильный ответ: 7. Простое число имеет ровно два натуральных делителя.",
    "en": "91 = 7 × 13. Its smallest prime divisor is 7."
  }
};

export default function D04_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={4} task={8}/>;
}
