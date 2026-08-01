import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Ayirma surati",
    "ru": "Практика к уроку 10. Сложение и вычитание дробей"
  },
  "prompt": {
    "uz": "13/14 − 2/7 ayirma natijasining suratini yozing.",
    "ru": "Вычислите 13/14 − 2/7 и запишите числитель результата."
  },
  "answer": "9",
  "explanation": {
    "uz": "13/14 − 2/7 = 13/14 − 4/14 = 9/14. Surat 9.",
    "ru": "Правильный ответ: 9. Сначала дроби приводят к общему знаменателю, затем выполняют действие с числителями."
  }
};

export default function D10_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={10} task={8}/>;
}
