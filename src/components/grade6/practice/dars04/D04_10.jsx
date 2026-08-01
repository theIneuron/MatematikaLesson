import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Ko'paytmani hisoblash",
    "ru": "Практика к уроку 4. Простые и составные числа"
  },
  "prompt": {
    "uz": "2 × 2 × 3 × 5 ko'paytma qaysi songa teng?",
    "ru": "Какому числу равно произведение 2 × 2 × 3 × 5?"
  },
  "options": [
    "30",
    "45",
    "60",
    "90"
  ],
  "answer": "60",
  "explanation": {
    "uz": "2 × 2 × 3 × 5 = 4 × 15 = 60.",
    "ru": "Правильный ответ: 60. Простое число имеет ровно два натуральных делителя."
  }
};

export default function D04_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={4} task={10}/>;
}
