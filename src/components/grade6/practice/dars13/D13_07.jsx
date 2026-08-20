import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Noma'lum son",
    "ru": "Практика к уроку 13. Взаимно обратные числа и нахождение целого",
    "en": "The unknown number"
  },
  "prompt": {
    "uz": "Bir sonning 3/8 qismi 21 ga teng. Avval bir qismini, keyin sakkiz qismini topib, noma'lum sonni aniqlang.",
    "ru": "Три восьмых некоторого числа равны 21. Найдите это число.",
    "en": "3/8 of a number is equal to 21. Find one part first, then eight parts, and work out the unknown number."
  },
  "options": [
    "48",
    "54",
    "56",
    "63"
  ],
  "answer": "56",
  "explanation": {
    "uz": "Sonning 3/8 qismi 21 bo'lsa, butun son 21 : 3 × 8 = 56.",
    "ru": "Правильный ответ: 56. Произведение взаимно обратных чисел равно единице.",
    "en": "If 3/8 of the number is 21, then the whole number is 21 : 3 × 8 = 56."
  }
};

export default function D13_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={13} task={7}/>;
}
