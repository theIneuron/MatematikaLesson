import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Sonning foizi",
    "ru": "Практика к уроку 21. Проценты"
  },
  "prompt": {
    "uz": "250 sonining 12 foizini hisoblab, sonli javobni yozing.",
    "ru": "Найдите 12 процентов от 250."
  },
  "answer": "30",
  "explanation": {
    "uz": "250 × 12/100 = 30.",
    "ru": "Правильный ответ: 30. Один процент равен одной сотой части целого."
  }
};

export default function D21_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={21} task={2}/>;
}
