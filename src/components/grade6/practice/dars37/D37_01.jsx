import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Aylana va doira",
    "ru": "Окружность и круг"
  },
  "prompt": {
    "uz": "Markazdan aylananing istalgan nuqtasigacha bo‘lgan kesma nima deyiladi?",
    "ru": "Как называется отрезок от центра до любой точки окружности?"
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
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, radius hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается radius."
  }
};

export default function D37_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={37} task={1}/>;
}
