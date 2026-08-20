import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Kitoblar sonini topish",
    "ru": "Практика к уроку 13. Взаимно обратные числа и нахождение целого",
    "en": "Finding the number of books"
  },
  "prompt": {
    "uz": "Kutubxonadagi kitoblarning 4/9 qismi 32 ta ilmiy kitobdan iborat. Kutubxonada jami nechta kitob borligini toping.",
    "ru": "Четыре девятых всех книг библиотеки составляют 32 научные книги. Сколько всего книг?",
    "en": "4/9 of the books in a library are 32 science books. Find how many books there are in the library altogether."
  },
  "options": [
    "64 ta",
    "68 ta",
    "72 ta",
    "81 ta"
  ],
  "answer": "72 ta",
  "translationsRu": {
    "64 ta": "64 книги",
    "68 ta": "68 книг",
    "72 ta": "72 книги",
    "81 ta": "81 книга"
  },
  "translationsEn": {
    "64 ta": "64 books",
    "68 ta": "68 books",
    "72 ta": "72 books",
    "81 ta": "81 books"
  },
  "explanation": {
    "uz": "Jami kitoblar soni 32 : 4 × 9 = 72 ta.",
    "ru": "Правильный ответ: 72 книги. Произведение взаимно обратных чисел равно единице.",
    "en": "The number of books altogether is 32 : 4 × 9 = 72."
  }
};

export default function D13_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={13} task={10}/>;
}
