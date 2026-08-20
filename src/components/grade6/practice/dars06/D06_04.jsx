import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "8 va 12 ning EKUKi",
    "ru": "Практика к уроку 6. Наименьшее общее кратное",
    "en": "The LCM of 8 and 12"
  },
  "prompt": {
    "uz": "8 va 12 ning eng kichik umumiy karralisini toping.",
    "ru": "Найдите наименьшее общее кратное чисел 8 и 12.",
    "en": "Find the least common multiple of 8 and 12."
  },
  "options": [
    "16",
    "20",
    "24",
    "48"
  ],
  "answer": "24",
  "explanation": {
    "uz": "8 va 12 ning birinchi umumiy karralisi 24.",
    "ru": "Правильный ответ: 24. НОК — наименьшее положительное общее кратное.",
    "en": "The first common multiple of 8 and 12 is 24."
  }
};

export default function D06_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={6} task={4}/>;
}
