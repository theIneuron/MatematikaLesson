import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Foiziga ko'ra son",
    "ru": "Практика к уроку 21. Проценты"
  },
  "prompt": {
    "uz": "Bir sonning 8 foizi 24 ga teng. Butun sonni foiziga ko'ra toping.",
    "ru": "Восемь процентов некоторого числа равны 24. Найдите число."
  },
  "answer": "300",
  "explanation": {
    "uz": "Butun son 24 : 0,08 = 300.",
    "ru": "Правильный ответ: 300. Один процент равен одной сотой части целого."
  }
};

export default function D21_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={21} task={8}/>;
}
