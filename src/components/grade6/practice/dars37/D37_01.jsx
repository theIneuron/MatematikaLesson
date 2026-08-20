import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Aylana va doira",
    "ru": "Окружность и круг",
    "en": "The circle and the disc"
  },
  "prompt": {
    "uz": "Markazdan aylananing istalgan nuqtasigacha bo‘lgan kesma nima deyiladi?",
    "ru": "Как называется отрезок от центра до любой точки окружности?",
    "en": "What is the line segment from the centre to any point of a circle called?"
  },
  "options": [
    "radius",
    "diametr",
    "vatar",
    "yoy"
  ],
  "answer": "radius",
  "translationsRu": {
    "radius": "радиус",
    "diametr": "диаметр",
    "vatar": "хорда",
    "yoy": "дуга"
  },
  "translationsEn": {
    "radius": "radius",
    "diametr": "diameter",
    "vatar": "chord",
    "yoy": "arc"
  },
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, radius hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается радиус.",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get the radius."
  }
};

export default function D37_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={37} task={1}/>;
}
