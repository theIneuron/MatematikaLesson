import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Noma'lum had",
    "ru": "Практика к уроку 17. Отношение",
    "en": "The unknown term"
  },
  "prompt": {
    "uz": "Ikki sonning nisbati 4 : 7. Birinchi son 24 bo'lsa, ikkinchi sonni proporsional kattalashtirib toping.",
    "ru": "Отношение двух чисел равно 4 : 7. Первое число равно 24. Найдите второе.",
    "en": "The ratio of two numbers is 4 : 7. The first number is 24. Scale the ratio up and find the second number."
  },
  "answer": "42",
  "explanation": {
    "uz": "4 qism 24 ga teng, bir qism 6; 7 qism 42.",
    "ru": "Правильный ответ: 42. При сокращении отношения оба его члена делят на одно и то же число.",
    "en": "4 parts are equal to 24, so one part is 6; and 7 parts are 42."
  }
};

export default function D17_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={17} task={8}/>;
}
