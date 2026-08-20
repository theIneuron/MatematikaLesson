import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Aylana va doira",
    "ru": "Окружность и круг",
    "en": "The circle and the disc"
  },
  "prompt": {
    "uz": "Qaysi kesma aylananing eng uzun vatari hisoblanadi?",
    "ru": "Какой отрезок является самой длинной хордой окружности?",
    "en": "Which line segment is the longest chord of a circle?"
  },
  "options": [
    "radius",
    "diametr",
    "yoy",
    "urinma"
  ],
  "answer": "diametr",
  "translationsRu": {
    "radius": "радиус",
    "diametr": "диаметр",
    "yoy": "дуга",
    "urinma": "касательная"
  },
  "translationsEn": {
    "radius": "radius",
    "diametr": "diameter",
    "yoy": "arc",
    "urinma": "tangent"
  },
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, diametr hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается диаметр.",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get the diameter."
  }
};

export default function D37_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={37} task={7}/>;
}
