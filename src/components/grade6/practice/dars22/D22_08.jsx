import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Boshlang'ich son",
    "ru": "Практика к уроку 22. Задачи на проценты"
  },
  "prompt": {
    "uz": "Bir son 20% ga kamaytirilgach 96 hosil bo'ldi. Boshlang'ich sonni toping.",
    "ru": "После уменьшения числа на 20% получилось 96. Найдите исходное число."
  },
  "answer": "120",
  "explanation": {
    "uz": "Boshlang'ich sonning 80 foizi 96: 96 : 0,8 = 120.",
    "ru": "Правильный ответ: 120. Новое значение находят умножением начального значения на коэффициент изменения."
  }
};

export default function D22_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={22} task={8}/>;
}
