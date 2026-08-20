import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Butun sonni kasrga bo'lish",
    "ru": "Практика к уроку 12. Деление обыкновенных дробей",
    "en": "Dividing a whole number by a fraction"
  },
  "prompt": {
    "uz": "5 sonini 3/4 kasrga bo'lganda qanday natija hosil bo'lishini toping. Butun sonni maxraji 1 bo'lgan kasr sifatida qarang.",
    "ru": "Разделите число 5 на дробь 3/4.",
    "en": "Find the result of dividing 5 by the fraction 3/4. Think of the whole number as a fraction with the denominator 1."
  },
  "options": [
    "15/4",
    "20/3",
    "8/5",
    "5/4"
  ],
  "answer": "20/3",
  "explanation": {
    "uz": "5 : 3/4 = 5 × 4/3 = 20/3.",
    "ru": "Правильный ответ: 20/3. Деление на дробь заменяют умножением на обратную дробь.",
    "en": "5 : 3/4 = 5 × 4/3 = 20/3."
  }
};

export default function D12_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={12} task={4}/>;
}
