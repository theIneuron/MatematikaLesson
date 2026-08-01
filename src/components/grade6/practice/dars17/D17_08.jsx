import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Noma'lum had",
    "ru": "Практика к уроку 17. Отношение"
  },
  "prompt": {
    "uz": "Ikki sonning nisbati 4 : 7. Birinchi son 24 bo'lsa, ikkinchi sonni proporsional kattalashtirib toping.",
    "ru": "Отношение двух чисел равно 4 : 7. Первое число равно 24. Найдите второе."
  },
  "answer": "42",
  "explanation": {
    "uz": "4 qism 24 ga teng, bir qism 6; 7 qism 42.",
    "ru": "Правильный ответ: 42. При сокращении отношения оба его члена делят на одно и то же число."
  }
};

export default function D17_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={17} task={8}/>;
}
