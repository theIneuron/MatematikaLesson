import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Kitoblar sonini topish",
    "ru": "Практика к уроку 13. Взаимно обратные числа и нахождение целого"
  },
  "prompt": {
    "uz": "Kutubxonadagi kitoblarning 4/9 qismi 32 ta ilmiy kitobdan iborat. Kutubxonada jami nechta kitob borligini toping.",
    "ru": "Четыре девятых всех книг библиотеки составляют 32 научные книги. Сколько всего книг?"
  },
  "options": [
    "64 ta",
    "68 ta",
    "72 ta",
    "81 ta"
  ],
  "answer": "72 ta",
  "translationsRu": {
    "64 ta": "64 шт.",
    "68 ta": "68 шт.",
    "72 ta": "72 шт.",
    "81 ta": "81 шт."
  },
  "explanation": {
    "uz": "Jami kitoblar soni 32 : 4 × 9 = 72 ta.",
    "ru": "Правильный ответ: 72 шт.. Произведение взаимно обратных чисел равно единице."
  }
};

export default function D13_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={13} task={10}/>;
}
