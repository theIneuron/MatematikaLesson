import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Kasrlarni qo'shish",
    "ru": "Практика к уроку 10. Сложение и вычитание дробей",
    "en": "Adding fractions"
  },
  "prompt": {
    "uz": "1/3 + 1/4 yig'indini hisoblab, qisqarmas javobni toping.",
    "ru": "Вычислите 1/3 + 1/4 и выберите несократимый ответ.",
    "en": "Work out the sum 1/3 + 1/4 and find the answer in its simplest form."
  },
  "options": [
    "2/7",
    "5/12",
    "7/12",
    "8/12"
  ],
  "answer": "7/12",
  "explanation": {
    "uz": "1/3 = 4/12 va 1/4 = 3/12; 4/12 + 3/12 = 7/12.",
    "ru": "Правильный ответ: 7/12. Сначала дроби приводят к общему знаменателю, затем выполняют действие с числителями.",
    "en": "1/3 = 4/12 and 1/4 = 3/12; 4/12 + 3/12 = 7/12."
  }
};

export default function D10_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={10} task={1}/>;
}
