import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Aylana va doira",
    "ru": "Окружность и круг"
  },
  "prompt": {
    "uz": "Aylana va uning ichki qismi birgalikda nima deyiladi?",
    "ru": "Как называется окружность вместе с внутренней областью?"
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
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, doira hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается doira."
  }
};

export default function D37_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={37} task={4}/>;
}
