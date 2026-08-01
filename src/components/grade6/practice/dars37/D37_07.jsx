import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Aylana va doira",
    "ru": "Окружность и круг"
  },
  "prompt": {
    "uz": "Qaysi kesma aylananing eng uzun vatari hisoblanadi?",
    "ru": "Какой отрезок является самой длинной хордой окружности?"
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
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, diametr hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается diametr."
  }
};

export default function D37_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={37} task={7}/>;
}
