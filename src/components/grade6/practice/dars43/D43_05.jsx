import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Uchburchak va murakkab shakllar yuzi",
    "ru": "Площадь треугольника и сложных фигур"
  },
  "prompt": {
    "uz": "Uchburchak yuzi asos bilan balandlik ko‘paytmasining yarmiga teng.",
    "ru": "Площадь треугольника равна половине произведения основания и высоты."
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

export default function D43_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={43} task={5}/>;
}
