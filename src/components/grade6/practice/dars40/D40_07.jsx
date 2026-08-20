import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "O'q simmetriyasi",
    "ru": "Осевая симметрия",
    "en": "Reflection symmetry"
  },
  "prompt": {
    "uz": "Qaysi bosh lotin harfi vertikal simmetriya o‘qiga ega?",
    "ru": "Какая заглавная латинская буква имеет вертикальную ось симметрии?",
    "en": "Which capital Latin letter has a vertical axis of symmetry?"
  },
  "options": [
    "A",
    "F",
    "G",
    "R"
  ],
  "answer": "A",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, A hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается A.",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get A."
  }
};

export default function D40_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={40} task={7}/>;
}
