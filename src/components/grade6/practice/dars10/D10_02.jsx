import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Kasrlarni ayirish",
    "ru": "Практика к уроку 10. Сложение и вычитание дробей"
  },
  "prompt": {
    "uz": "7/10 − 1/6 ayirma natijasining suratini yozing.",
    "ru": "Вычислите 7/10 − 1/6 и запишите числитель результата."
  },
  "answer": "8",
  "explanation": {
    "uz": "7/10 − 1/6 = 21/30 − 5/30 = 16/30 = 8/15. Surat 8.",
    "ru": "Правильный ответ: 8. Сначала дроби приводят к общему знаменателю, затем выполняют действие с числителями."
  }
};

export default function D10_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={10} task={2}/>;
}
