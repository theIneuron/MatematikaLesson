import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Aylana va doira",
    "ru": "Окружность и круг",
    "en": "The circle and the disc"
  },
  "prompt": {
    "uz": "Aylana va uning ichki qismi birgalikda nima deyiladi?",
    "ru": "Как называется окружность вместе с внутренней областью?",
    "en": "What is a circle together with the part inside it called?"
  },
  "options": [
    "yoy",
    "doira",
    "vatar",
    "radius"
  ],
  "answer": "doira",
  "translationsRu": {
    "yoy": "дуга",
    "doira": "круг",
    "vatar": "хорда",
    "radius": "радиус"
  },
  "translationsEn": {
    "yoy": "arc",
    "doira": "disc",
    "vatar": "chord",
    "radius": "radius"
  },
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, doira hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается круг.",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get the disc."
  }
};

export default function D37_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={37} task={4}/>;
}
