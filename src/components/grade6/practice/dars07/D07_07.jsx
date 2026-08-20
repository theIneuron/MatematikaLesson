import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Teng bo'lmagan kasr",
    "ru": "Практика к уроку 7. Основное свойство дроби",
    "en": "The fraction that is not equal"
  },
  "prompt": {
    "uz": "Quyidagi kasrlardan qaysi biri 4/7 ga teng emas?",
    "ru": "Какая дробь не равна 4/7?",
    "en": "Which of these fractions is not equal to 4/7?"
  },
  "options": [
    "8/14",
    "12/21",
    "16/28",
    "20/32"
  ],
  "answer": "20/32",
  "explanation": {
    "uz": "20/32 = 5/8; bu 4/7 ga teng emas. Qolganlari 4/7 ga qisqaradi.",
    "ru": "Правильный ответ: 20/32. При умножении или делении числителя и знаменателя на одно число значение дроби не меняется.",
    "en": "20/32 = 5/8, and that is not equal to 4/7. The others all reduce to 4/7."
  }
};

export default function D07_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={7} task={7}/>;
}
