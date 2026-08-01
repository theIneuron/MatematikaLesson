import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Foizni kasrga aylantirish",
    "ru": "Практика к уроку 21. Проценты"
  },
  "prompt": {
    "uz": "36% ni avval yuzdan ulush sifatida yozing, so'ng qisqartirilgan oddiy kasr ko'rinishini toping.",
    "ru": "Запишите 36% в виде несократимой обыкновенной дроби."
  },
  "options": [
    "9/25",
    "18/25",
    "36/10",
    "3/5"
  ],
  "answer": "9/25",
  "explanation": {
    "uz": "36% = 36/100. Surat va maxrajni 4 ga bo'lsak 9/25.",
    "ru": "Правильный ответ: 9/25. Один процент равен одной сотой части целого."
  }
};

export default function D21_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={21} task={1}/>;
}
