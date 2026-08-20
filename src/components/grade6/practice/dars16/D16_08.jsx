import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Qismiga ko'ra butun",
    "ru": "Практика к уроку 16. Задачи с дробями и десятичными дробями",
    "en": "The whole from its part"
  },
  "prompt": {
    "uz": "Bir sonning 0,4 qismi 28 ga teng. Ma'lum qismni o'nli kasrga bo'lib, butun sonni toping.",
    "ru": "Четыре десятых некоторого числа равны 28. Найдите целое число.",
    "en": "0,4 of a number is equal to 28. Divide the known part by the decimal and find the whole number."
  },
  "answer": "70",
  "explanation": {
    "uz": "Butun son 28 : 0,4 = 70 ga teng.",
    "ru": "Правильный ответ: 70. Сначала величины приводят к одному виду, затем выполняют нужное действие.",
    "en": "The whole number is 28 : 0,4 = 70."
  }
};

export default function D16_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={16} task={8}/>;
}
