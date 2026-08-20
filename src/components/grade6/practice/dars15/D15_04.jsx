import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Kasrning davri",
    "ru": "Практика к уроку 15. Периодические дроби и округление",
    "en": "The period of a decimal"
  },
  "prompt": {
    "uz": "4,1(27) davriy o'nli kasrida cheksiz takrorlanadigan davrni aniqlang va to'g'ri javobni tanlang.",
    "ru": "Укажите период дроби 4,1(27).",
    "en": "Work out which part repeats without end in the recurring decimal 4,1(27) and choose the right answer."
  },
  "options": [
    "1",
    "2",
    "27",
    "127"
  ],
  "answer": "27",
  "explanation": {
    "uz": "4,1(27) yozuvida qavs ichidagi 27 raqamlar guruhi davr hisoblanadi.",
    "ru": "Правильный ответ: 27. При округлении смотрят на первую цифру после сохраняемого разряда.",
    "en": "In the record 4,1(27) the group of digits 27 inside the brackets is the period."
  }
};

export default function D15_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={15} task={4}/>;
}
