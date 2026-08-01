import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Geometriya va ma'lumotlar bo'limi yakuni",
    "ru": "Итог раздела геометрии и данных"
  },
  "prompt": {
    "uz": "Kvadrat 4 ta simmetriya o‘qiga ega.",
    "ru": "Квадрат имеет 4 оси симметрии."
  },
  "options": [
    "Ha",
    "Yo'q"
  ],
  "answer": "Ha",
  "translationsRu": {
    "Ha": "Да",
    "Yo'q": "Нет"
  },
  "explanation": {
    "uz": "Berilgan fikr mavzuning asosiy qoidasiga to‘liq mos keladi.",
    "ru": "Утверждение полностью соответствует основному правилу темы."
  }
};

export default function D46_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={46} task={5}/>;
}
