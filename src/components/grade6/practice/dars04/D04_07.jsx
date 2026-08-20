import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Yoyilmani tekshirish",
    "ru": "Практика к уроку 4. Простые и составные числа",
    "en": "Checking a factorisation"
  },
  "prompt": {
    "uz": "Qaysi tenglik tub ko'paytuvchilarga to'g'ri ajratilgan?",
    "ru": "Какое равенство является правильным разложением числа 44 на простые множители?",
    "en": "Which equality is the correct prime factorisation of 44?"
  },
  "options": [
    "44 = 2² × 11",
    "44 = 4 × 11",
    "44 = 2 × 22",
    "44 = 2³ × 5"
  ],
  "answer": "44 = 2² × 11",
  "explanation": {
    "uz": "44 = 4 × 11 = 2² × 11; yoyilmadagi barcha ko'paytuvchilar tub.",
    "ru": "Правильный ответ: 44 = 2² × 11. Простое число имеет ровно два натуральных делителя.",
    "en": "44 = 4 × 11 = 2² × 11; every factor in the factorisation is prime."
  }
};

export default function D04_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={4} task={7}/>;
}
