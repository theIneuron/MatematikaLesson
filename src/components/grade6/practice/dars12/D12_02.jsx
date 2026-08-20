import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Natijaning surati",
    "ru": "Практика к уроку 12. Деление обыкновенных дробей",
    "en": "The numerator of the result"
  },
  "prompt": {
    "uz": "7/12 : 14/15 ifodani teskari kasrga ko'paytirib hisoblang. Qisqarmas natijaning suratini yozing.",
    "ru": "Вычислите 7/12 : 14/15 и запишите числитель результата.",
    "en": "Work out 7/12 : 14/15 by multiplying by the reciprocal. Write the numerator of the answer in its simplest form."
  },
  "answer": "5",
  "explanation": {
    "uz": "7/12 : 14/15 = 7/12 × 15/14 = 5/8. Natijaning surati 5.",
    "ru": "Правильный ответ: 5. Деление на дробь заменяют умножением на обратную дробь.",
    "en": "7/12 : 14/15 = 7/12 × 15/14 = 5/8. The numerator of the result is 5."
  }
};

export default function D12_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={12} task={2}/>;
}
