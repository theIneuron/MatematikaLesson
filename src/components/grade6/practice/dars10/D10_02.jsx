import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Kasrlarni ayirish",
    "ru": "Практика к уроку 10. Сложение и вычитание дробей",
    "en": "Subtracting fractions"
  },
  "prompt": {
    "uz": "7/10 − 1/6 ayirma natijasining suratini yozing.",
    "ru": "Вычислите 7/10 − 1/6 и запишите числитель результата.",
    "en": "Write the numerator of the difference 7/10 − 1/6."
  },
  "answer": "8",
  "explanation": {
    "uz": "7/10 − 1/6 = 21/30 − 5/30 = 16/30 = 8/15. Surat 8.",
    "ru": "Правильный ответ: 8. Сначала дроби приводят к общему знаменателю, затем выполняют действие с числителями.",
    "en": "7/10 − 1/6 = 21/30 − 5/30 = 16/30 = 8/15. The numerator is 8."
  }
};

export default function D10_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={10} task={2}/>;
}
