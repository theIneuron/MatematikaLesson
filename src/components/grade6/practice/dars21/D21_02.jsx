import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Sonning foizi",
    "ru": "Практика к уроку 21. Проценты",
    "en": "A percentage of a number"
  },
  "prompt": {
    "uz": "250 sonining 12 foizini hisoblab, sonli javobni yozing.",
    "ru": "Найдите 12 процентов от 250.",
    "en": "Work out 12 percent of 250 and write the answer as a number."
  },
  "answer": "30",
  "explanation": {
    "uz": "250 × 12/100 = 30.",
    "ru": "Правильный ответ: 30. Один процент равен одной сотой части целого.",
    "en": "250 × 12/100 = 30."
  }
};

export default function D21_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={21} task={2}/>;
}
