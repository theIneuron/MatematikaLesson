import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Yig'indini qisqartirish",
    "ru": "Практика к уроку 10. Сложение и вычитание дробей"
  },
  "prompt": {
    "uz": "5/8 + 7/20 yig'indini eng sodda ko'rinishda toping.",
    "ru": "Вычислите 5/8 + 7/20 и сократите результат."
  },
  "options": [
    "12/28",
    "19/20",
    "39/40",
    "47/40"
  ],
  "answer": "39/40",
  "explanation": {
    "uz": "5/8=25/40 va 7/20=14/40; yig'indi 39/40.",
    "ru": "Правильный ответ: 39/40. Сначала дроби приводят к общему знаменателю, затем выполняют действие с числителями."
  }
};

export default function D10_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={10} task={7}/>;
}
